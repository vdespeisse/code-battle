<template>
  <div ref="el" class="editor"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { dracula } from 'thememirror'

const emit = defineEmits(['update'])
const value = defineModel<string>()

const el = ref()
const extensions = [
  basicSetup,
  javascript(),
  history(),
  dracula,
  // syntaxHighlighting(defaultHighlightStyle),
  keymap.of([defaultKeymap, historyKeymap]),
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
  border: 1px solid black;
}
</style>
