import { reactive } from 'vue'
import { runTests, parseFunction } from '../lib/run'
import { TestCase, Room, User } from '../types'
import { formatError } from '../utils'
import { getRoomScenario, user, db } from '../plugins/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
interface State {
  code: string
  description: string
  tests: TestCase[]
  timer?: number
  startedAt?: number
  roomState: 'setup' | 'loading' | 'starting' | 'running' | 'error' | 'closed'
  status: 'idle' | 'pass' | 'fail' | 'parsing_error' | 'error' | 'running'
  bestScore: number
  terminal: string
  activePanel: 'editor' | 'terminal' | 'description' | null
  scenarioId?: string
  timeRemaining?: number
  room?: Room
}
const state = reactive<State>({
  code: '',
  description: '',
  tests: [],
  roomState: 'loading',
  status: 'idle',
  terminal: '',
  activePanel: null,
  bestScore: 0,
})
function colorLine(message: string, color?: 'green' | 'red') {
  if (!color) return message
  return `<span class="${color}-text">${message}</span>`
}
function printTerminal(message: string, color?: 'green' | 'red') {
  state.terminal += colorLine('<br>' + message, color)
}
function getNewRoomState(room: Room, winners: Partial<User>[] = []) {
  const winnerCount = winners.length
  if (!winnerCount) return 'running'
  if (typeof room.endCondition === 'number') {
    if (winnerCount >= room.endCondition) {
      return 'closed'
    }
    return 'running'
  } else if (room.endCondition === 'half') {
    if (winnerCount >= room.participants.length / 2) {
      return 'closed'
    }
    return 'running'
    // if (room.endCondition === 'first') or default
  } else {
    return 'closed'
  }
}
async function addWinner() {
  if (!state.room) {
    throw new Error('No room')
  }
  if (!user.value) {
    throw new Error('No user')
  }
  const currentWinners = state.room.winners || []
  const winners = [...currentWinners, { id: user.value.userId, username: user.value.username }]
  const roomRef = doc(db, 'rooms', state.room.id)
  const roomState = getNewRoomState(state.room, winners)
  console.log('roomState', roomState, winners)
  await updateDoc(roomRef, {
    winners,
    state: roomState,
  })
}
const actions = {
  setScenario: async (roomId: any) => {
    const scenario = await getRoomScenario(roomId)
    state.code = scenario.code
    state.description = scenario.description
    state.tests = JSON.parse(scenario.tests)
    state.terminal = ''
    state.bestScore = 0
    state.scenarioId = scenario.id
  },
  updateRoom(room: Room) {
    // TODO move the other stuff in there
    state.room = room
  },
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
      const status = passed === total ? 'pass' : 'fail'
      state.status = status
      printTerminal(`${passed}/${total} tests passed`, status === 'pass' ? 'green' : 'red')

      if (passed > state.bestScore) {
        state.bestScore = passed
      }
      if (status === 'pass') {
        printTerminal('Success!', 'green')
        addWinner()
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
