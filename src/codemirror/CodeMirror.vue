<template>
  <div ref="el" class="editor"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, baseExtensions, languages } from './codemirror'

const emit = defineEmits(['update'])
const value = defineModel<string>()
const props = defineProps<{ mode: 'javascript' | 'markdown' | 'json' }>()
const el = ref()
let skip = false
const extensions = [
  baseExtensions,
  EditorView.updateListener.of(viewUpdate => {
    // https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/11
    // onUpdate(viewUpdate)
    // doc changed
    if (viewUpdate.docChanged) {
      // onChange(viewUpdate.state.doc.toString(), viewUpdate)
      skip = true
      value.value = viewUpdate.state.doc.toString()
    }
  }),
]
let view: EditorView
onMounted(() => {
  const lang = languages[props.mode] || languages.javascript
  extensions.push(lang())
  const state = EditorState.create({ doc: value.value || '', extensions })
  view = new EditorView({ state, parent: el.value })
  console.log('Created editor', view)
})
watchEffect(() => {
  if (skip) {
    skip = false
    return
  }
  console.log('Value changed', value.value)
  if (!view) return
  view.setState(EditorState.create({ doc: value.value || '', extensions }))
})
</script>

<style>
.editor {
  position: relative;
  height: calc(100% - 36px);
  width: 100%;
  overflow: hidden;
}
.editor .cm-editor {
  height: 100%;
  /* @apply border border-layer-1; */
}
/* .editor .cm-focused {
  @apply border-layer-1;
} */
.editor .cm-editor .cm-selectionBackground {
  background: #094771 !important;
}
</style>
