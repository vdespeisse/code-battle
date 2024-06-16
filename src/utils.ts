export function debounce(fn: Function, n = 100) {
  let handle: any
  return (...args: any[]) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}

function formatStack(stack: string) {
  try {
    const blobUrl = `blob:${window.location.origin}/`
    return stack
      .split('\n')
      .slice(0, -2)
      .map(d => d.replace(blobUrl, ''))
      .join('<br>')
  } catch (e) {
    return stack
  }
}
export function formatError(error: any) {
  try {
    return formatStack(error?.stack) || `${error.name}: ${error?.message}` || error
  } catch (e) {
    return error?.stack || error?.message || error
  }
}
