import { TestCase } from '../types'
export function runTests(solution: Function, testCases: TestCase[]) {
  let passed = 0
  for (const { input, output } of testCases) {
    if (solution(input) === output) {
      passed += 1
    }
  }
  return { passed, total: testCases.length }
}

export async function parseFunction(fnDefinition: string) {
  const blob = new Blob([fnDefinition], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  const module = await import(url)
  URL.revokeObjectURL(url)
  return module.default
}
