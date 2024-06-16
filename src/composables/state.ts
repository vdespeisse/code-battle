import { reactive } from 'vue'
import { runTests, parseFunction } from '../lib/run'
import { TestCase } from '../types'
import { formatError } from '../utils'
interface State {
  code: string
  description: string
  tests: TestCase[]
  status: 'idle' | 'running' | 'pass' | 'fail' | 'parsing_error' | 'error'
  terminal: string
}
const state = reactive<State>({
  code: '',
  description: '',
  tests: [],
  status: 'idle',
  terminal: '',
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
    let fn
    try {
      fn = await parseFunction(state.code)
    } catch (e) {
      state.terminal = formatError(e)
      state.status = 'parsing_error'
      return
    }
    state.status = 'running'
    try {
      const { passed, total } = runTests(fn, state.tests)
      state.status = passed === total ? 'pass' : 'fail'
      state.terminal = `${passed}/${total} tests passed`
    } catch (e) {
      state.terminal = formatError(e)
      state.status = 'error'
    }
  },
}

export default function useState() {
  return {
    state,
    actions,
  }
}
