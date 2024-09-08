import type { Component, InjectionKey } from 'vue'
// import type { Store } from './store'

export interface TestCase {
  input: any
  output: any
}

export interface Scenario {
  id: string
  name: string
  description: string
  tests: string
  code: string
  difficulty?: 'easy' | 'medium' | 'hard'
}
export interface Room {
  id: string
  participants: string[]
  scenario: string
  timer: number
  status: 'setup' | 'running' | 'closed'
  endCondition: 'first' | 'half' | number
  startedAt: number
  winners: Partial<User>[]
}
export interface User {
  id: string
  username: string
  roomId: string
}
// export type EditorMode = 'js' | 'css' | 'ssr'
// export interface EditorProps {
//   value: string
//   filename: string
//   readonly?: boolean
//   mode?: EditorMode
// }
// export interface EditorEmits {
//   (e: 'change', code: string): void
// }
// export type EditorComponentType = Component<EditorProps>

// export type OutputModes = 'preview' | EditorMode

// export const injectKeyStore: InjectionKey<Store> = Symbol('store')
