export function safeJsonParse(values: string): any[] {
  try {
    const lines = JSON.parse(values)
    if (Array.isArray(lines)) {
      return lines
    } else {
      console.error("Parsed value is not an array.")
      return []
    }
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return []
  }
}

export default safeJsonParse
