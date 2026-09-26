<template>
  <div class="dither-knob-wrapper">
    <div class="knob-area">
      <div class="arrow-indicator">&#9654;</div>
      <div class="knob" @click="nextMode">
        <div class="knob-face" :style="{ transform: 'rotate(' + rotation + 'deg)' }">
          <svg width="52" height="52" viewBox="0 0 52 52" class="dither-icon">
            <g v-if="modelValue === 0">
              <!-- Floyd-Steinberg: scattered dots -->
              <circle cx="10" cy="12" r="1.5" fill="#222" />
              <circle cx="20" cy="8" r="1" fill="#222" />
              <circle cx="32" cy="14" r="1.5" fill="#222" />
              <circle cx="15" cy="22" r="1" fill="#222" />
              <circle cx="26" cy="20" r="1.5" fill="#222" />
              <circle cx="38" cy="24" r="1" fill="#222" />
              <circle cx="12" cy="32" r="1" fill="#222" />
              <circle cx="22" cy="30" r="1.5" fill="#222" />
              <circle cx="34" cy="34" r="1" fill="#222" />
              <circle cx="18" cy="40" r="1.5" fill="#222" />
              <circle cx="28" cy="38" r="1" fill="#222" />
              <circle cx="40" cy="42" r="1.5" fill="#222" />
            </g>
            <g v-else-if="modelValue === 1">
              <!-- Bayer: checkerboard -->
              <rect x="4" y="4" width="5" height="5" fill="#222" />
              <rect x="16" y="4" width="5" height="5" fill="#222" />
              <rect x="28" y="4" width="5" height="5" fill="#222" />
              <rect x="40" y="4" width="5" height="5" fill="#222" />
              <rect x="10" y="10" width="5" height="5" fill="#222" />
              <rect x="22" y="10" width="5" height="5" fill="#222" />
              <rect x="34" y="10" width="5" height="5" fill="#222" />
              <rect x="4" y="16" width="5" height="5" fill="#222" />
              <rect x="16" y="16" width="5" height="5" fill="#222" />
              <rect x="28" y="16" width="5" height="5" fill="#222" />
              <rect x="40" y="16" width="5" height="5" fill="#222" />
              <rect x="10" y="22" width="5" height="5" fill="#222" />
              <rect x="22" y="22" width="5" height="5" fill="#222" />
              <rect x="34" y="22" width="5" height="5" fill="#222" />
              <rect x="4" y="28" width="5" height="5" fill="#222" />
              <rect x="16" y="28" width="5" height="5" fill="#222" />
              <rect x="28" y="28" width="5" height="5" fill="#222" />
              <rect x="40" y="28" width="5" height="5" fill="#222" />
            </g>
            <g v-else-if="modelValue === 2">
              <!-- Ordered: diagonal dots -->
              <circle cx="8" cy="8" r="1.5" fill="#222" />
              <circle cx="18" cy="13" r="1.5" fill="#222" />
              <circle cx="28" cy="18" r="1.5" fill="#222" />
              <circle cx="38" cy="23" r="1.5" fill="#222" />
              <circle cx="13" cy="28" r="1.5" fill="#222" />
              <circle cx="23" cy="33" r="1.5" fill="#222" />
              <circle cx="33" cy="38" r="1.5" fill="#222" />
              <circle cx="43" cy="43" r="1.5" fill="#222" />
              <circle cx="8" cy="23" r="1" fill="#222" />
              <circle cx="23" cy="8" r="1" fill="#222" />
              <circle cx="38" cy="38" r="1" fill="#222" />
              <circle cx="18" cy="38" r="1" fill="#222" />
            </g>
            <g v-else-if="modelValue === 3">
              <!-- Atkinson: clustered dots -->
              <circle cx="12" cy="12" r="2" fill="#222" />
              <circle cx="16" cy="12" r="2" fill="#222" />
              <circle cx="12" cy="16" r="2" fill="#222" />
              <circle cx="30" cy="12" r="2" fill="#222" />
              <circle cx="34" cy="12" r="2" fill="#222" />
              <circle cx="30" cy="16" r="2" fill="#222" />
              <circle cx="12" cy="30" r="2" fill="#222" />
              <circle cx="16" cy="30" r="2" fill="#222" />
              <circle cx="12" cy="34" r="2" fill="#222" />
              <circle cx="30" cy="30" r="2" fill="#222" />
              <circle cx="34" cy="30" r="2" fill="#222" />
              <circle cx="30" cy="34" r="2" fill="#222" />
            </g>
            <g v-else>
              <!-- None: Ø symbol -->
              <circle cx="26" cy="26" r="12" fill="none" stroke="#222" stroke-width="2.5" />
              <line x1="17" y1="17" x2="35" y2="35" stroke="#222" stroke-width="2.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div class="lcd-display">
      <span class="lcd-text">{{ modeName }}</span>
    </div>
  </div>
</template>

<script>
const MODE_NAMES = ['Floyd-St', 'Bayer', 'Ordered', 'Atkinson', 'None']

export default {
  name: 'DitherKnob',
  props: {
    modelValue: { type: Number, default: 0 }
  },
  emits: ['update:modelValue'],
  computed: {
    rotation() {
      return this.modelValue * 72
    },
    modeName() {
      return MODE_NAMES[this.modelValue] || 'Unknown'
    }
  },
  methods: {
    nextMode() {
      const next = (this.modelValue + 1) % 5
      this.$emit('update:modelValue', next)
    }
  }
}
</script>

<style scoped>
.dither-knob-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.knob-area {
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow-indicator {
  font-size: 10px;
  color: var(--color-orange);
}

.knob {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(145deg, #c8c8c8, #999);
  border: 2px solid #777;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 2px 6px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.3);
  overflow: hidden;
  transition: transform 0.15s ease;
}

.knob:active {
  transform: scale(0.96);
}

.knob-face {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.dither-icon {
  width: 52px;
  height: 52px;
}

.lcd-display {
  background: var(--color-dark);
  border: 1px solid #444;
  border-radius: 3px;
  padding: 2px 8px;
  min-width: 64px;
  text-align: center;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.4);
}

.lcd-text {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  color: var(--color-orange);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
