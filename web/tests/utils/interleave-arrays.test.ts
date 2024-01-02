import { interleaveArrays } from "@/utils/interleave-arrays"

describe("web/src/utils/interleave-arrays.ts", () => {
  describe(".interleaveArrays", () => {
    test("when interleaving arrays, if the first array is longer, it appends remaing elements from first array", () => {
      const a = ["a", "b", "c", "d", "e", "f"]
      const b = [1, 2, 3, 4, 5]
      const chunkSize = 2

      const result = interleaveArrays(a, b, { chunkSize })

      expect(result).toEqual(["a", 1, 2, "b", 3, 4, "c", 5, "d", "e", "f"])
    })

    test("when interleaving arrays, if the second array is longer it appends remaing elements from second array", () => {
      const a = ["a", "b", "c"]
      const b = [1, 2, 3, 4, 5, 6, 7, 8]
      const chunkSize = 2

      const result = interleaveArrays(a, b, { chunkSize })

      expect(result).toEqual(["a", 1, 2, "b", 3, 4, "c", 5, 6, 7, 8])
    })
  })
})
