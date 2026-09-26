<template>
  <div class="gameboy-camera">
    <div class="screw top-left"></div>
    <div class="screw top-right"></div>
    <div class="screw bottom-left"></div>
    <div class="screw bottom-right"></div>

    <ViewfinderScreen
      :dither-mode="ditherMode"
      :brightness="brightness"
      :contrast="contrast"
      :palette="palette"
      :zoom="zoom"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @shutter="takeSnapshot"
    />

    <div class="mid-section">
      <InfoPanel :dither-mode="ditherMode" :is-recording="isRecording" />
      <RecButton :is-recording="isRecording" @toggle="toggleRecording" />
    </div>

    <div class="browser-dpad-section">
      <StickerBrowser />
      <DPad @up="onDpadUp" @down="onDpadDown" @left="onDpadLeft" @right="onDpadRight" @ok="onDpadOk" />
    </div>

    <div class="bottom-controls">
      <div class="control-col">
        <DitherKnob v-model="ditherMode" />
      </div>
      <div class="control-divider"></div>
      <div class="control-col knobs-col">
        <RotaryKnob v-model="contrast" :size="51" label="contrast" />
        <RotaryKnob v-model="brightness" :size="51" label="bright" />
      </div>
      <div class="control-divider"></div>
      <div class="control-col">
        <PaletteSelector v-model="palette" />
      </div>
    </div>
  </div>
</template>

<script>
import ViewfinderScreen from './ViewfinderScreen.vue'
import InfoPanel from './InfoPanel.vue'
import RecButton from './RecButton.vue'
import StickerBrowser from './StickerBrowser.vue'
import DPad from './DPad.vue'
import RotaryKnob from './RotaryKnob.vue'
import DitherKnob from './DitherKnob.vue'
import PaletteSelector from './PaletteSelector.vue'

export default {
  name: 'GameboyCamera',
  components: {
    ViewfinderScreen,
    InfoPanel,
    RecButton,
    StickerBrowser,
    DPad,
    RotaryKnob,
    DitherKnob,
    PaletteSelector
  },
  data() {
    return {
      ditherMode: 0,
      brightness: 50,
      contrast: 50,
      palette: 0,
      zoom: 1,
      isRecording: false
    }
  },
  methods: {
    zoomIn() {
      this.zoom = Math.min(4, this.zoom + 0.5)
    },
    zoomOut() {
      this.zoom = Math.max(1, this.zoom - 0.5)
    },
    toggleRecording() {
      this.isRecording = !this.isRecording
    },
    takeSnapshot() {
      const canvas = this.$el.querySelector('canvas')
      if (canvas) {
        const link = document.createElement('a')
        link.download = 'gameboy-capture.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    },
    onDpadUp() {
      this.brightness = Math.min(100, this.brightness + 5)
    },
    onDpadDown() {
      this.brightness = Math.max(0, this.brightness - 5)
    },
    onDpadLeft() {
      this.contrast = Math.max(0, this.contrast - 5)
    },
    onDpadRight() {
      this.contrast = Math.min(100, this.contrast + 5)
    },
    onDpadOk() {
      this.takeSnapshot()
    }
  }
}
</script>

<style scoped>
.gameboy-camera {
  width: 360px;
  min-height: 800px;
  background: linear-gradient(180deg, #c8c0b8, #b8b0a8 30%, #a89890 100%);
  border-radius: 16px;
  position: relative;
  box-shadow:
    0 4px 20px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.3),
    inset 0 -1px 0 rgba(0,0,0,0.1);
  overflow: hidden;
  padding-bottom: 12px;
}

.screw {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #ddd, #999);
  border: 1px solid #888;
  z-index: 10;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.3);
}

.screw::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 1px;
  background: #777;
  transform: translate(-50%, -50%) rotate(45deg);
}

.screw.top-left { top: 8px; left: 8px; }
.screw.top-right { top: 8px; right: 8px; }
.screw.bottom-left { bottom: 8px; left: 8px; }
.screw.bottom-right { bottom: 8px; right: 8px; }

.mid-section {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
}

.browser-dpad-section {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 4px 0;
}

.browser-dpad-section > :first-child {
  flex: 1;
}

.bottom-controls {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 12px 8px;
  gap: 0;
}

.control-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.knobs-col {
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
}

.control-divider {
  width: 1px;
  height: 80px;
  background: linear-gradient(180deg, transparent, #999, transparent);
  align-self: center;
}
</style>
