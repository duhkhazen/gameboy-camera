<template>
  <div class="dpad-container">
    <div class="dpad">
      <button class="dpad-btn up" @click="$emit('up')">
        <svg width="10" height="8" viewBox="0 0 10 8">
          <polygon points="5,0 10,8 0,8" fill="#555" />
        </svg>
      </button>
      <button class="dpad-btn left" @click="$emit('left')">
        <svg width="8" height="10" viewBox="0 0 8 10">
          <polygon points="0,5 8,0 8,10" fill="#555" />
        </svg>
      </button>
      <button class="dpad-center" @click="$emit('ok')">
        <span>ok</span>
      </button>
      <button class="dpad-btn right" @click="$emit('right')">
        <svg width="8" height="10" viewBox="0 0 8 10">
          <polygon points="8,5 0,0 0,10" fill="#555" />
        </svg>
      </button>
      <button class="dpad-btn down" @click="$emit('down')">
        <svg width="10" height="8" viewBox="0 0 10 8">
          <polygon points="5,8 10,0 0,0" fill="#555" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DPad',
  emits: ['up', 'down', 'left', 'right', 'ok']
}
</script>

<style scoped>
.dpad-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.dpad {
  display: grid;
  grid-template-columns: 28px 28px 28px;
  grid-template-rows: 28px 28px 28px;
  gap: 0px;
  position: relative;
}

.dpad-btn {
  background: linear-gradient(145deg, #bbb, #999);
  border: 1px solid #777;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.dpad-btn:active {
  transform: scale(0.93);
  background: linear-gradient(145deg, #aaa, #888);
}

.dpad-btn.up {
  grid-column: 2;
  grid-row: 1;
  border-radius: 4px 4px 0 0;
}

.dpad-btn.left {
  grid-column: 1;
  grid-row: 2;
  border-radius: 4px 0 0 4px;
}

.dpad-btn.right {
  grid-column: 3;
  grid-row: 2;
  border-radius: 0 4px 4px 0;
}

.dpad-btn.down {
  grid-column: 2;
  grid-row: 3;
  border-radius: 0 0 4px 4px;
}

.dpad-center {
  grid-column: 2;
  grid-row: 2;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ccc, #aaa);
  border: 2px solid #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  font-size: 7px;
  color: #555;
  text-transform: uppercase;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.4);
  transition: transform 0.1s;
}

.dpad-center:active {
  transform: scale(0.93);
}
</style>
