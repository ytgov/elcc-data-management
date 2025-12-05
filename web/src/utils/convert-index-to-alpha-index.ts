export function convertIndexToAlphaIndex(columnIndex: number): string {
  const letters: string[] = []
  let currentIndex = columnIndex

  while (currentIndex >= 0) {
    const letter = String.fromCharCode(65 + (currentIndex % 26))
    letters.unshift(letter)

    currentIndex = Math.floor(currentIndex / 26) - 1
  }

  return letters.join("")
}

export default convertIndexToAlphaIndex
