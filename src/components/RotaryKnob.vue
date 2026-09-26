<template>
  <div class="rotary-knob-wrapper" :style="{ width: size + 20 + 'px' }">
    <div class="knob-markings">
      <span
        v-for="n in 5"
        :key="n"
        class="marking"
        :style="markingStyle(n - 1)"
      >{{ (n - 1) * 25 }}</span>
    </div>
    <div
      class="knob"
      :style="knobStyle"
      @mousedown="startDrag"
      @touchstart.prevent="startDrag"
    >
      <div class="knob-indicator" :style="indicatorStyle"></div>
    </div>
    <div class="knob-label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'RotaryKnob',
  props: {
    modelValue: { type: Number, default: 50 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    size: { type: Number, default: 51 },
    label: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      dragging: false,
      startY: 0,
      startValue: 0
    }
  },
  computed: {
    normalizedValue() {
      return (this.modelValue - this.min) / (this.max - this.min)
    },
    angle() {
      return -135 + this.normalizedValue * 270
    },
    knobStyle() {
      return {
        width: this.size + 'px',
        height: this.size + 'px',
        background: 'conic-gradient(from 0deg, #aaa, #ddd 10%, #999 20%, #ccc 30%, #aaa 40%, #ddd 50%, #999 60%, #ccc 70%, #aaa 80%, #ddd 90%, #aaa 100%)',
        transform: 'rotate(' + this.angle + 'deg)'
      }
    },
    indicatorStyle() {
      return {
        width: '2px',
        height: this.size / 2 - 4 + 'px',
        background: 'var(--color-orange)',
        position: 'absolute',
        top: '4px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '1px'
      }
    }
  },
  methods: {
    markingStyle(index) {
      const angle = -135 + index * (270 / 4)
      const rad = (angle - 90) * Math.PI / 180
      const r = this.size / 2 + 12
      const cx = this.size / 2 + 10
      const cy = this.size / 2 + 6
      return {
        position: 'absolute',
        left: (cx + r * Math.cos(rad)) + 'px',
        top: (cy + r * Math.sin(rad)) + 'px',
        transform: 'translate(-50%, -50%)',
        fontSize: '7px',
        color: '#777'
      }
    },
    startDrag(e) {
      this.dragging = true
      this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
      this.startValue = this.modelValue

      const onMove = (ev) => {
        if (!this.dragging) return
        const y = ev.type === 'touchmove' ? ev.touches[0].clientY : ev.clientY
        const delta = (this.startY - y) * 0.5
        const range = this.max - this.min
        const newVal = Math.round(Math.max(this.min, Math.min(this.max, this.startValue + delta * range / 100)))
        this.$emit('update:modelValue', newVal)
      }

      const onEnd = () => {
        this.dragging = false
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onEnd)
      document.addEventListener('touchmove', onMove)
      document.addEventListener('touchend', onEnd)
    }
  }
}
</script>

<style scoped>
.rotary-knob-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 10px;
}

.knob-markings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.knob {
  border-radius: 50%;
  border: 2px solid #777;
  cursor: grab;
  position: relative;
  box-shadow:
    0 2px 6px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.3),
    inset 0 -1px 0 rgba(0,0,0,0.2);
  user-select: none;
  touch-action: none;
}

.knob:active {
  cursor: grabbing;
}

.knob-label {
  font-family: 'Courier New', monospace;
  font-size: 8px;
  color: #777;
  text-transform: uppercase;
  margin-top: 4px;
  letter-spacing: 0.5px;
}
</style>
