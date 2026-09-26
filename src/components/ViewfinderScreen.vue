<template>
  <div class="viewfinder">
    <div class="bezel">
      <div class="screen" ref="screenContainer"></div>
    </div>
    <div class="side-controls">
      <button class="zoom-btn zoom-in" @click="$emit('zoom-in')" title="Zoom In">
        <svg width="16" height="12" viewBox="0 0 16 12">
          <polygon points="8,0 16,12 0,12" fill="var(--color-orange)" />
        </svg>
      </button>
      <button class="shutter-btn" @click="$emit('shutter')">
        <span>shutter</span>
      </button>
      <button class="zoom-btn zoom-out" @click="$emit('zoom-out')" title="Zoom Out">
        <svg width="16" height="12" viewBox="0 0 16 12">
          <polygon points="8,12 16,0 0,0" fill="var(--color-orange)" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { createP5Sketch } from '../p5Sketch.js'

export default {
  name: 'ViewfinderScreen',
  props: {
    ditherMode: { type: Number, default: 0 },
    brightness: { type: Number, default: 50 },
    contrast: { type: Number, default: 50 },
    palette: { type: Number, default: 0 },
    zoom: { type: Number, default: 1 }
  },
  emits: ['zoom-in', 'zoom-out', 'shutter'],
  data() {
    return {
      p5Instance: null
    }
  },
  computed: {
    vmProxy() {
      return {
        ditherMode: this.ditherMode,
        brightness: this.brightness,
        contrast: this.contrast,
        palette: this.palette,
        zoom: this.zoom
      }
    }
  },
  mounted() {
    const vm = this.vmProxy
    const self = this
    const reactiveVm = new Proxy(vm, {
      get(target, prop) {
        return self[prop] !== undefined ? self[prop] : target[prop]
      }
    })
    this.p5Instance = createP5Sketch(this.$refs.screenContainer, reactiveVm)
  },
  beforeUnmount() {
    if (this.p5Instance) {
      this.p5Instance.remove()
    }
  }
}
</script>

<style scoped>
.viewfinder {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
}

.bezel {
  width: 274px;
  height: 274px;
  border-radius: 19px;
  background: linear-gradient(145deg, #c0c0c0, #a0a0a0);
  border: 2px solid #888;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.4),
    inset 0 -1px 0 rgba(0,0,0,0.2),
    0 2px 8px rgba(0,0,0,0.3);
}

.screen {
  width: 238px;
  height: 239px;
  background: var(--color-dark);
  border-radius: 17px;
  overflow: hidden;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.5);
}

.screen :deep(canvas) {
  display: block;
  border-radius: 17px;
  image-rendering: pixelated;
}

.side-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.zoom-btn {
  width: 32px;
  height: 28px;
  background: linear-gradient(145deg, #c8c8c8, #999);
  border: 1px solid #777;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transition: transform 0.1s;
}

.zoom-btn:active {
  transform: scale(0.95);
}

.shutter-btn {
  width: 36px;
  height: 52px;
  background: var(--color-orange);
  border: 2px solid #c07a48;
  border-radius: 6px;
  transform: rotate(0deg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: transform 0.1s;
}

.shutter-btn:active {
  transform: scale(0.95);
}

.shutter-btn span {
  font-size: 7px;
  font-family: 'Courier New', monospace;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style>
