/**
 * Simple wrapper around window.confirm that returns true if the
 * confirm dialog is blocked.
 */
export function blockedToTrueConfirm(message: string) {
  const startTime = Date.now()
  const result = window.confirm(message)
  const endTime = Date.now()

  // If the confirm returns faster than a human could possibly click
  // (e.g., in 1 millisecond), assume it's been blocked
  if (endTime - startTime < 1) {
    return true
  }

  return result
}

export default blockedToTrueConfirm
