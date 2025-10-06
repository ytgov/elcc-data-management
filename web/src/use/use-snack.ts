import { reactive, toRef, ToRef } from "vue"
import { type VSnackbar } from "vuetify/components"

type VSnackbarProps = VSnackbar["$props"]

const state = reactive<{
  message: string
  options: VSnackbarProps
}>({
  message: "",
  options: {},
})

/**
 * @example
 * const snack = useSnack()
 * snack("Hello world", { color: "success" })
 *
 * @example
 * const snack = useSnack()
 * snack.success("Hello world")
 */
export function useSnack(defaultOptions: VSnackbarProps = {}): {
  (message: string, options?: VSnackbarProps): void
  message: ToRef<string>
  options: ToRef<VSnackbarProps>
  notify: (message: string, options?: VSnackbarProps) => void
  reset: () => void
  success: (message: string, options?: VSnackbarProps) => void
  error: (message: string, options?: VSnackbarProps) => void
  info: (message: string, options?: VSnackbarProps) => void
  warning: (message: string, options?: VSnackbarProps) => void
} {
  const notify = (message: string, options: VSnackbarProps = {}) => {
    state.message = message
    state.options = { ...defaultOptions, ...options }
  }

  notify.message = toRef(state, "message")
  notify.options = toRef(state, "options")

  notify.notify = notify

  notify.reset = () => {
    state.message = ""
    state.options = {}
  }

  notify.success = (message: string, options: VSnackbarProps = {}) => {
    notify(message, { color: "success", ...options })
  }

  notify.error = (message: string, options: VSnackbarProps = {}) => {
    notify(message, { color: "error", ...options })
  }

  notify.info = (message: string, options: VSnackbarProps = {}) => {
    notify(message, { color: "info", ...options })
  }

  notify.warning = (message: string, options: VSnackbarProps = {}) => {
    notify(message, { color: "warning", ...options })
  }

  // @ts-expect-error - VSnackbarProps definition is probably not infinte
  return notify
}

export default useSnack
