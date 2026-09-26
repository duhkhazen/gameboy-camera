<template>
  <div class="palette-selector">
    <div class="palette-label-left">p</div>
    <div class="knob-area">
      <div class="number-arc">
        <span
          v-for="n in 5"
          :key="n"
          class="arc-number"
          :class="{ active: modelValue === n - 1 }"
          :style="arcStyle(n - 1)"
        >{{ n - 1 }}</span>
      </div>
      <div class="knob" @click="nextPalette">
        <div class="knob-indicator" :style="indicatorRotation"></div>
      </div>
    </div>
    <div class="palette-label-bottom">palette</div>
  </div>
</template>

<script>
export default {
  name: 'PaletteSelector',
  props: {
    modelValue: { type: Number, default: 0 }
  },
  emits: ['update:modelValue'],
  computed: {
    indicatorRotation() {
      const angle = -90 + this.modelValue * 45
      return {
        transform: 'rotate(' + angle + 'deg)'
      }
    }
  },
  methods: {
    nextPalette() {
      const next = (this.modelValue + 1) % 5
      this.$emit('update:modelValue', next)
    },
    arcStyle(index) {
      const angle = -90 + index * 45
      const rad = (angle * Math.PI) / 180
      const r = 38
      return {
        position: 'absolute',
        left: (42 + r * Math.cos(rad)) + 'px',
        top: (42 + r * Math.sin(rad)) + 'px',
        transform: 'translate(-50%, -50%)'
      }
    }
  }
}
</script>

<style scoped>
.palette-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.palette-label-left {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  color: #777;
  text-transform: lowercase;
  align-self: flex-start;
  margin-left: 4px;
}

.knob-area {
  position: relative;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-arc {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.arc-number {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  color: #666;
  transition: color 0.2s;
}

.arc-number.active {
  color: var(--color-orange);
  font-weight: bold;
}

.knob {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f0f0f0, #d0d0d0);
  border: 2px solid #bbb;
  cursor: pointer;
  position: relative;
  box-shadow:
    0 2px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.8),
    inset 0 -1px 0 rgba(0,0,0,0.1);
  transition: transform 0.1s;
}

.knob:active {
  transform: scale(0.96);
}

.knob-indicator {
  position: absolute;
  top: 4px;
  left: 50%;
  width: 2px;
  height: 16px;
  background: var(--color-dark);
  transform-origin: 50% 22px;
  border-radius: 1px;
  transition: transform 0.3s ease;
}

.palette-label-bottom {
  font-family: 'Courier New', monospace;
  font-size: 8px;
  color: #777;
  text-transform: lowercase;
  letter-spacing: 0.5px;
}
</style>
