<template>
  <div class="info-panel">
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Name</span>
        <span class="info-value">SHOT_001</span>
      </div>
      <div class="info-row">
        <span class="info-label">Type</span>
        <span class="info-value">{{ ditherName }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date</span>
        <span class="info-value">{{ currentDate }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Output</span>
        <span class="info-value">128x128px</span>
      </div>
    </div>
    <div class="focus-diagram">
      <span class="focus-arrow">&larr; f</span>
      <div class="focus-bar">
        <div class="focus-indicator"></div>
      </div>
      <span class="focus-arrow">b &rarr;</span>
    </div>
    <div v-if="isRecording" class="rec-indicator">
      <span class="rec-dot"></span> REC
    </div>
  </div>
</template>

<script>
const DITHER_NAMES = ['Floyd-Stein', 'Bayer 4x4', 'Ordered 8x8', 'Atkinson', 'None']

export default {
  name: 'InfoPanel',
  props: {
    ditherMode: { type: Number, default: 0 },
    isRecording: { type: Boolean, default: false }
  },
  computed: {
    ditherName() {
      return DITHER_NAMES[this.ditherMode] || 'Unknown'
    },
    currentDate() {
      const d = new Date()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const yy = String(d.getFullYear()).slice(-2)
      return mm + '/' + dd + '/' + yy
    }
  }
}
</script>

<style scoped>
.info-panel {
  background: var(--color-darker);
  padding: 8px 16px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 12px;
  flex: 1;
}

.info-row {
  display: flex;
  gap: 6px;
}

.info-label {
  color: #666;
  text-transform: uppercase;
  font-size: 9px;
}

.info-value {
  color: var(--color-orange);
  font-size: 9px;
}

.focus-diagram {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: #666;
}

.focus-bar {
  width: 40px;
  height: 4px;
  background: #444;
  border-radius: 2px;
  position: relative;
}

.focus-indicator {
  position: absolute;
  left: 50%;
  top: -1px;
  width: 6px;
  height: 6px;
  background: var(--color-orange);
  border-radius: 50%;
  transform: translateX(-50%);
}

.focus-arrow {
  white-space: nowrap;
}

.rec-indicator {
  color: #ff3333;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: blink 1s infinite;
}

.rec-dot {
  width: 6px;
  height: 6px;
  background: #ff3333;
  border-radius: 50%;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
