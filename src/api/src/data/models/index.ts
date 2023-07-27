export * from "./centre-model"
export * from "./user-model"
export * from "./centre-submissions-model"
export * from "./log"

export interface APIResponse<T> {
  data: T | T[] | undefined
  messages: APIReponseMessage[]
  errors: APIResponseError[]
}

export interface APIReponseMessage {
  text: string
  variant: string
}

export interface APIResponseError {
  text: string
}
