<template>
  <div ref="el" class="editor"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, baseExtensions } from './codemirror'

const emit = defineEmits(['update'])
const value = defineModel<string>()

const el = ref()
const extensions = [
  baseExtensions,
  EditorView.updateListener.of(viewUpdate => {
    // https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/11
    // onUpdate(viewUpdate)
    // doc changed
    if (viewUpdate.docChanged) {
      // onChange(viewUpdate.state.doc.toString(), viewUpdate)
      value.value = viewUpdate.state.doc.toString()
    }
  }),
]

onMounted(() => {
  const state = EditorState.create({ doc: value.value || '', extensions })
  const view = new EditorView({ state, parent: el.value })
  console.log('Created editor', view)
})
</script>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.editor .cm-editor {
  height: 100%;
  @apply border-2 border-layer-1;
}
.editor .cm-focused {
  @apply border-green-600;
}
</style>
