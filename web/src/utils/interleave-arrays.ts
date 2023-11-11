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
  return bArray.flatMap((b, bIndex) => {
    const a = aArray[bIndex]
    if (a !== undefined && bIndex % chunkSize === 0) {
      return [a, b]
    }

    return b
  })
}
