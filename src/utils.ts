export function debounce(fn: Function, n = 100) {
  let handle: any
  return (...args: any[]) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}

export function formatError(error: any) {
  try {
    return error?.stack || `${error.name}: ${error?.message}` || error
  } catch (e) {
    return error?.stack || error?.message || error
  }
}
