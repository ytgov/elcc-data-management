export async function sleepMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default sleepMs
