import { reactive } from 'vue'
import { runTests, parseFunction } from '../lib/run'
import { TestCase } from '../types'
import { formatError } from '../utils'
interface State {
  code: string
  description: string
  tests: TestCase[]
  status: 'idle' | 'running' | 'pass' | 'fail' | 'parsing_error' | 'error'
  bestScore: number
  terminal: string
  activePanel: 'editor' | 'terminal' | 'description' | null
}
const state = reactive<State>({
  code: '',
  description: '',
  tests: [],
  status: 'idle',
  terminal: '',
  activePanel: null,
  bestScore: 0,
})
const actions = {
  run: async () => {
    //     try {
    //   const res = await runFunction(state.code, [1])
    //   result.value = res
    //   return res
    // } catch (e) {
    //   errorMessage.value = formatError(e)
    // }

    console.log('run', state.code)
    state.terminal = 'Running tests...'
    let fn
    try {
      fn = await parseFunction(state.code)
    } catch (e) {
      state.terminal = formatError(e)
      state.status = 'parsing_error'
      return
    }
    state.status = 'running'
    const log = console.log
    console.log = function (...args) {
      // DO MESSAGE HERE.
      state.terminal += '<br>LOG: ' + args.join(' ')
      log(...args)
    }
    try {
      const { passed, total } = runTests(fn, state.tests)
      state.status = passed === total ? 'pass' : 'fail'
      state.terminal += `<br>${passed}/${total} tests passed`
      if (passed > state.bestScore) {
        state.bestScore = passed
      }
      console.log = log
    } catch (e) {
      state.terminal += '<br>' + formatError(e)
      state.status = 'error'
      console.log = log
    }
  },
}

export default function useState() {
  return {
    state,
    actions,
  }
}
