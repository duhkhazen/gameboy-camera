<template>
  <div class="sticker-browser">
    <div class="browser-bezel">
      <div class="browser-inner">
        <div class="browser-header">
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: activeTab === 'stickers' }"
              @click="activeTab = 'stickers'"
            >stickers</button>
            <button
              class="tab"
              :class="{ active: activeTab === 'gifs' }"
              @click="activeTab = 'gifs'"
            >gifs</button>
          </div>
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="search..."
            />
          </div>
        </div>
        <div class="item-grid">
          <div
            v-for="(item, index) in filteredItems"
            :key="index"
            class="grid-item"
            :class="{ selected: selectedIndex === index }"
            @click="selectedIndex = index"
          >
            <div class="thumbnail">
              <span class="thumb-icon">{{ item.icon }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StickerBrowser',
  data() {
    return {
      activeTab: 'stickers',
      searchQuery: '',
      selectedIndex: -1,
      items: [
        { icon: '★', name: 'star', type: 'stickers' },
        { icon: '♥', name: 'heart', type: 'stickers' },
        { icon: '☺', name: 'smile', type: 'stickers' },
        { icon: '♫', name: 'music', type: 'stickers' },
        { icon: '☀', name: 'sun', type: 'stickers' },
        { icon: '❄', name: 'snow', type: 'stickers' },
        { icon: '❤', name: 'love', type: 'stickers' },
        { icon: '⚛', name: 'atom', type: 'stickers' },
        { icon: '▶', name: 'play', type: 'gifs' },
        { icon: '↻', name: 'loop', type: 'gifs' },
        { icon: '⌂', name: 'house', type: 'gifs' },
        { icon: '⚑', name: 'flag', type: 'gifs' },
        { icon: '✉', name: 'mail', type: 'gifs' },
        { icon: '✎', name: 'edit', type: 'gifs' },
        { icon: '❖', name: 'diamond', type: 'gifs' },
        { icon: '⌘', name: 'cmd', type: 'gifs' }
      ]
    }
  },
  computed: {
    filteredItems() {
      let items = this.items.filter(i => i.type === this.activeTab)
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        items = items.filter(i => i.name.includes(q))
      }
      return items
    }
  }
}
</script>

<style scoped>
.sticker-browser {
  padding: 4px 16px;
}

.browser-bezel {
  background: linear-gradient(145deg, #c0c0c0, #a0a0a0);
  border-radius: 10px;
  padding: 3px;
  border: 1px solid #888;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.3),
    0 1px 4px rgba(0,0,0,0.2);
}

.browser-inner {
  background: var(--color-dark);
  border-radius: 8px;
  padding: 8px;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.4);
}

.browser-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.tabs {
  display: flex;
  gap: 2px;
}

.tab {
  background: transparent;
  border: 1px solid #555;
  color: #777;
  font-family: 'Courier New', monospace;
  font-size: 9px;
  padding: 2px 8px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s;
}

.tab.active {
  color: var(--color-orange);
  border-color: var(--color-orange);
}

.search-box input {
  background: #222;
  border: 1px solid #444;
  color: #999;
  font-family: 'Courier New', monospace;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 3px;
  width: 80px;
  outline: none;
}

.search-box input:focus {
  border-color: var(--color-orange);
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.grid-item {
  aspect-ratio: 1;
  background: #262626;
  border-radius: 4px;
  border: 1px solid #3a3a3a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}

.grid-item:hover {
  border-color: #666;
}

.grid-item.selected {
  border-color: var(--color-orange);
  box-shadow: 0 0 4px rgba(217,140,90,0.3);
}

.thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-icon {
  font-size: 18px;
  opacity: 0.6;
}

.grid-item.selected .thumb-icon {
  opacity: 1;
}
</style>
