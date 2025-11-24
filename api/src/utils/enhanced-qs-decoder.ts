import qs from "qs"

export function enhancedQsDecoder(params: string) {
  return qs.parse(params, {
    strictNullHandling: true,
    decoder(str, defaultDecoder, charset, type) {
      if (type === "value") {
        if (str === "true") return true
        if (str === "false") return false
      }

      return defaultDecoder(str, defaultDecoder, charset)
    },
  })
}

export default enhancedQsDecoder
