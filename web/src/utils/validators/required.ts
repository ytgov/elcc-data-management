export const required: (value: string) => boolean | string = (value) =>
  !!value || "Field is required"

export default required
