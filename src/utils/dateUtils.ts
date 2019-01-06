interface DateFormat {
  defaultOptions?: Intl.DateTimeFormatOptions
  (
    date: number | string | Date,
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string
}

const dateFormat: DateFormat = (
  date,
  locales = 'ja-JP-u-ca-iso8601',
  options = null
) => {
  options = options
    ? dateFormat.defaultOptions
    : { ...dateFormat.defaultOptions, ...options }

  return new Date(date).toLocaleString(locales, options)
}

dateFormat.prototype.defaultOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

export { dateFormat }
