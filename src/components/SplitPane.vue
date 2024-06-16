<script setup lang="ts">
import { type MaybeRefOrGetter, computed, inject, reactive, ref, toValue } from 'vue'
// import { injectKeyStore } from './types'

const props = defineProps<{ layout?: 'horizontal' | 'vertical' }>()
const isVertical = computed(() => props.layout === 'vertical')

const container = ref()

const state = reactive({
  dragging: false,
  split: 50,
  viewHeight: 0,
  viewWidth: 0,
})

const boundSplit = computed(() => {
  const { split } = state
  return split < 20 ? 20 : split > 80 ? 80 : split
})

let startPosition = 0
let startSplit = 0

function dragStart(e: MouseEvent) {
  state.dragging = true
  startPosition = isVertical.value ? e.pageY : e.pageX
  startSplit = boundSplit.value
}

function dragMove(e: MouseEvent) {
  if (state.dragging) {
    const position = isVertical.value ? e.pageY : e.pageX
    const totalSize = isVertical.value ? container.value.offsetHeight : container.value.offsetWidth
    const dp = position - startPosition
    state.split = startSplit + +((dp / totalSize) * 100).toFixed(2)
  }
}

function dragEnd() {
  state.dragging = false
}
</script>

<template>
  <div
    ref="container"
    class="split-pane flex flex-row"
    :class="{
      vertical: isVertical,
      dragging: state.dragging,
    }"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div class="left" :style="{ [isVertical ? 'height' : 'width']: boundSplit + '%' }">
      <slot name="left" />
    </div>
    <div class="dragger relative" @mousedown.prevent="dragStart" />
    <div class="right" :style="{ [isVertical ? 'height' : 'width']: 100 - boundSplit + '%' }">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.split-pane {
  display: flex;
  position: relative;
}
.split-pane.dragging {
  cursor: ew-resize;
}
.dragging .left,
.dragging .right {
  pointer-events: none;
}
.left,
.right {
  position: relative;
  height: 100%;
}
.left {
  border-right: 1px solid var(--border);
}
.dragger {
  /* position: absolute; */
  width: 2px;
  @apply px-2;
  cursor: ew-resize;
}
.dragger:hover::after {
  @apply bg-green-600;
  height: 100%;
}
.dragger::after {
  @apply bg-layer-1;
  border-radius: 2px;
  content: '';
  height: 20px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
}

/* vertical */
.split-pane.vertical {
  @apply flex-col;
}

.split-pane.vertical.dragging {
  cursor: ns-resize;
}
.split-pane.vertical .dragger {
  cursor: ns-resize;
  width: 100%;
  height: 2px;
  @apply py-2 px-0;
}
.split-pane.vertical .dragger::after {
  border-radius: 2px;
  content: '';
  height: 2px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
}
.split-pane.vertical .dragger:hover::after {
  width: 100%;
}

.vertical .left,
.vertical .right {
  width: 100%;
}
.vertical .left {
  border-right: none;
  border-bottom: 1px solid var(--border);
}
</style>
