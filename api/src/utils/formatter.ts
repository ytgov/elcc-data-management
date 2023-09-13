export function formatDollar(
  input: number | undefined,
  locales: string | string[] | undefined = "en-US",
  options: Intl.NumberFormatOptions = {}
) {
  const formatter = new Intl.NumberFormat(locales, {
    style: "currency",
    currency: "USD",
    ...options,
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })

  if (input === Infinity || input === -Infinity) {
    throw new Error("Infinity and -Infinity are not supported.")
  }

  if (Object.is(input, -0) || Number.isNaN(input) || input === undefined) {
    return formatter.format(0)
  }

  return formatter.format(input)
}
