export function runTests(solution: any, testCases: TestCase[]): boolean {
  // let passed = 0
  for (const { input, output } of testCases) {
    if (solution(input) !== output) {
      return false
    }
  }
  return true
}

export async function runFunction(fnDefintion: string, args: any[]) {
  const blob = new Blob([fnDefintion], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  const module = await import(url)
  URL.revokeObjectURL(url)
  return module.default(...args)
}
