/* Example usage
import { times } from "lodash"
const a = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o",
           "p","q","r","s","t","u","v","w","x","y","z"]
const b = times(200, Number)
const chunkSize = 2; // Specify the chunk size

const interleaveIterator = interleaveArrays(a, b, chunkSize);

// Consume the iterator
for (let value of interleaveIterator) {
  console.log(value);
}

// output: ['a', 1, 2, 'b', 3, 4, 'c', 5, 'd', 'e', ...52, 53, 54, 55 ...200]
*/

export function interleaveArrays<A, B>(
  aArray: A[],
  bArray: B[],
  { chunkSize = 2 }: { chunkSize?: number } = {}
): (A | B)[] {
  let aIndex = 0
  const interleavedArray = bArray.flatMap((b, bIndex) => {
    if (aIndex < aArray.length && bIndex % chunkSize === 0) {
      const a = aArray[aIndex]
      aIndex += 1
      return [a, b]
    }

    return b
  })

  const remainingAElements = aArray.slice(aIndex)
  return interleavedArray.concat(remainingAElements)
}
