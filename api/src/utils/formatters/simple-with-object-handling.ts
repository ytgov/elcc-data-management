import { format } from "winston"
import { has } from "lodash"

import { MESSAGE } from "triple-beam"
import stringify from "safe-stable-stringify"
import { type TransformableInfo } from "logform"

/**
 * Winston's (Logform's) simple formatter, but stringifies object messages instead of producing "[object Object]".
 *
 * See https://github.com/winstonjs/logform/blob/18795bc185d5eb485fb0289d08c1e220a6d3e44c/simple.js
 */
export const simpleWithObjectHandling = format((info: TransformableInfo) => {
  const stringifiedRest = stringify(
    Object.assign({}, info, {
      level: undefined,
      message: undefined,
      splat: undefined,
    })
  )

  let message = info.message
  if (typeof info.message === "object" && `${message}` === "[object Object]") {
    message = stringify(info.message)
  }

  let padding = ""
  if (has(info, "padding") && has(info.padding, info.level)) {
    padding = info.padding[info.level]
  }

  if (stringifiedRest !== "{}") {
    info[MESSAGE] = `${info.level}:${padding} ${message} ${stringifiedRest}`
  } else {
    info[MESSAGE] = `${info.level}:${padding} ${message}`
  }

  return info
})

export default simpleWithObjectHandling
