import p5 from 'p5'

const PALETTES = [
  // 0: GameBoy green
  [[15, 56, 15], [48, 98, 48], [139, 172, 15], [155, 188, 15]],
  // 1: Grayscale
  [[0, 0, 0], [85, 85, 85], [170, 170, 170], [255, 255, 255]],
  // 2: Sepia
  [[44, 30, 20], [100, 70, 46], [170, 130, 90], [230, 200, 160]],
  // 3: Cold blue
  [[10, 20, 40], [40, 70, 120], [100, 140, 190], [180, 210, 240]],
  // 4: High-contrast B&W
  [[0, 0, 0], [60, 60, 60], [200, 200, 200], [255, 255, 255]]
]

const BAYER_4x4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
]

const ORDERED_8x8 = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21]
]

function closestPaletteColor(r, g, b, palette) {
  let minDist = Infinity
  let best = palette[0]
  const gray = 0.299 * r + 0.587 * g + 0.114 * b
  for (let i = 0; i < palette.length; i++) {
    const pg = 0.299 * palette[i][0] + 0.587 * palette[i][1] + 0.114 * palette[i][2]
    const d = Math.abs(gray - pg)
    if (d < minDist) {
      minDist = d
      best = palette[i]
    }
  }
  return best
}

function applyBrightnessContrast(pixels, w, h, brightness, contrast) {
  const bFactor = (brightness - 50) * 2.55
  const cFactor = (contrast - 50) / 50
  const cf = cFactor >= 0 ? 1 + cFactor * 3 : 1 + cFactor

  for (let i = 0; i < w * h * 4; i += 4) {
    for (let c = 0; c < 3; c++) {
      let v = pixels[i + c]
      v += bFactor
      v = ((v - 128) * cf) + 128
      pixels[i + c] = Math.max(0, Math.min(255, v))
    }
  }
}

function ditherFloydSteinberg(pixels, w, h, palette) {
  const data = new Float32Array(pixels.length)
  for (let i = 0; i < pixels.length; i++) data[i] = pixels[i]

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const oldR = data[idx]
      const oldG = data[idx + 1]
      const oldB = data[idx + 2]
      const newC = closestPaletteColor(oldR, oldG, oldB, palette)

      data[idx] = newC[0]
      data[idx + 1] = newC[1]
      data[idx + 2] = newC[2]

      const errR = oldR - newC[0]
      const errG = oldG - newC[1]
      const errB = oldB - newC[2]

      const distribute = (dx, dy, factor) => {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const ni = (ny * w + nx) * 4
          data[ni] += errR * factor
          data[ni + 1] += errG * factor
          data[ni + 2] += errB * factor
        }
      }

      distribute(1, 0, 7 / 16)
      distribute(-1, 1, 3 / 16)
      distribute(0, 1, 5 / 16)
      distribute(1, 1, 1 / 16)
    }
  }

  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = Math.max(0, Math.min(255, Math.round(data[i])))
  }
}

function ditherBayer(pixels, w, h, palette) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const threshold = (BAYER_4x4[y % 4][x % 4] / 16 - 0.5) * 64

      const r = Math.max(0, Math.min(255, pixels[idx] + threshold))
      const g = Math.max(0, Math.min(255, pixels[idx + 1] + threshold))
      const b = Math.max(0, Math.min(255, pixels[idx + 2] + threshold))

      const c = closestPaletteColor(r, g, b, palette)
      pixels[idx] = c[0]
      pixels[idx + 1] = c[1]
      pixels[idx + 2] = c[2]
    }
  }
}

function ditherOrdered(pixels, w, h, palette) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const threshold = (ORDERED_8x8[y % 8][x % 8] / 64 - 0.5) * 64

      const r = Math.max(0, Math.min(255, pixels[idx] + threshold))
      const g = Math.max(0, Math.min(255, pixels[idx + 1] + threshold))
      const b = Math.max(0, Math.min(255, pixels[idx + 2] + threshold))

      const c = closestPaletteColor(r, g, b, palette)
      pixels[idx] = c[0]
      pixels[idx + 1] = c[1]
      pixels[idx + 2] = c[2]
    }
  }
}

function ditherAtkinson(pixels, w, h, palette) {
  const data = new Float32Array(pixels.length)
  for (let i = 0; i < pixels.length; i++) data[i] = pixels[i]

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const oldR = data[idx]
      const oldG = data[idx + 1]
      const oldB = data[idx + 2]
      const newC = closestPaletteColor(oldR, oldG, oldB, palette)

      data[idx] = newC[0]
      data[idx + 1] = newC[1]
      data[idx + 2] = newC[2]

      const errR = (oldR - newC[0]) / 8
      const errG = (oldG - newC[1]) / 8
      const errB = (oldB - newC[2]) / 8

      const distribute = (dx, dy) => {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const ni = (ny * w + nx) * 4
          data[ni] += errR
          data[ni + 1] += errG
          data[ni + 2] += errB
        }
      }

      distribute(1, 0)
      distribute(2, 0)
      distribute(-1, 1)
      distribute(0, 1)
      distribute(1, 1)
      distribute(0, 2)
    }
  }

  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = Math.max(0, Math.min(255, Math.round(data[i])))
  }
}

function ditherNone(pixels, w, h, palette) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const c = closestPaletteColor(pixels[idx], pixels[idx + 1], pixels[idx + 2], palette)
      pixels[idx] = c[0]
      pixels[idx + 1] = c[1]
      pixels[idx + 2] = c[2]
    }
  }
}

const DITHER_FNS = [ditherFloydSteinberg, ditherBayer, ditherOrdered, ditherAtkinson, ditherNone]
const CAPTURE_W = 128
const CAPTURE_H = 128
const DISPLAY_W = 238
const DISPLAY_H = 239

export function createP5Sketch(container, vm) {
  const sketch = (p) => {
    let capture = null
    let buffer = null

    p.setup = () => {
      const canvas = p.createCanvas(DISPLAY_W, DISPLAY_H)
      canvas.parent(container)
      p.pixelDensity(1)
      p.noSmooth()

      buffer = p.createGraphics(CAPTURE_W, CAPTURE_H)
      buffer.pixelDensity(1)

      capture = p.createCapture(p.VIDEO, { flipped: true })
      capture.size(CAPTURE_W, CAPTURE_H)
      capture.hide()
    }

    p.draw = () => {
      if (!capture) return

      const zoom = vm.zoom || 1
      const srcSize = CAPTURE_W / zoom
      const offset = (CAPTURE_W - srcSize) / 2

      buffer.image(capture, 0, 0, CAPTURE_W, CAPTURE_H, offset, offset, srcSize, srcSize)
      buffer.loadPixels()

      if (buffer.pixels.length === 0) return

      const pixelData = new Uint8ClampedArray(buffer.pixels)

      applyBrightnessContrast(pixelData, CAPTURE_W, CAPTURE_H, vm.brightness, vm.contrast)

      const paletteIdx = vm.palette || 0
      const palette = PALETTES[paletteIdx] || PALETTES[0]
      const ditherIdx = vm.ditherMode || 0
      const ditherFn = DITHER_FNS[ditherIdx] || DITHER_FNS[0]

      ditherFn(pixelData, CAPTURE_W, CAPTURE_H, palette)

      for (let i = 0; i < pixelData.length; i++) {
        buffer.pixels[i] = pixelData[i]
      }
      buffer.updatePixels()

      p.image(buffer, 0, 0, DISPLAY_W, DISPLAY_H)
    }
  }

  return new p5(sketch)
}
