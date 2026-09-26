<template>
  <div class="rec-wrapper">
    <button class="rec-button" :class="{ recording: isRecording }" @click="$emit('toggle')">
      <span class="rec-inner"></span>
    </button>
    <span class="rec-dot-indicator" :class="{ active: isRecording }"></span>
  </div>
</template>

<script>
export default {
  name: 'RecButton',
  props: {
    isRecording: { type: Boolean, default: false }
  },
  emits: ['toggle']
}
</script>

<style scoped>
.rec-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 16px;
}

.rec-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(145deg, #cc3333, #991111);
  border: 2px solid #880000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 2px 4px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transition: transform 0.1s;
}

.rec-button:active {
  transform: scale(0.93);
}

.rec-button.recording {
  animation: pulse 1.2s ease-in-out infinite;
}

.rec-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff4444;
  box-shadow: 0 0 4px rgba(255,68,68,0.6);
}

.rec-button.recording .rec-inner {
  box-shadow: 0 0 8px rgba(255,68,68,0.9);
}

.rec-dot-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #555;
  transition: background 0.3s;
}

.rec-dot-indicator.active {
  background: #ff3333;
  box-shadow: 0 0 6px rgba(255,51,51,0.7);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 0 0 rgba(255,0,0,0.4); }
  50% { box-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 0 8px rgba(255,0,0,0); }
}
</style>
