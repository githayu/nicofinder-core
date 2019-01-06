const numberFormatOptions = {
  useGrouping: false,
  minimumIntegerDigits: 2,
}

const durationFormatOptions = {
  shouldHour: true,
  shouldPad: false,
}

export function separateNumeric(num: number) {
  return new Intl.NumberFormat().format(num)
}

export function durationFormat(
  seconds: number,
  options = durationFormatOptions
) {
  let hou
  let min
  const sec = new Intl.NumberFormat('ja', numberFormatOptions).format(
    Math.floor(seconds % 60)
  )

  options = { ...durationFormatOptions, ...options }

  if (options.shouldHour && 3600 <= seconds) {
    hou = String(Math.floor(seconds / 3600))
    min = new Intl.NumberFormat('ja', numberFormatOptions).format(
      Math.floor((seconds / 60) % 60)
    )
  } else if (options.shouldPad) {
    min = new Intl.NumberFormat('ja', numberFormatOptions).format(
      Math.floor((seconds / 60) % 60)
    )
  } else {
    min = String(Math.floor(seconds / 60))
  }

  return [
    ...(options.shouldHour && 3600 <= seconds ? [hou] : []),
    min,
    sec,
  ].join(':')
}

export function vposFormat(vpos: number, shouldMSec = true, type = 'array') {
  const minutes = new Intl.NumberFormat('ja', numberFormatOptions).format(
    Math.floor(vpos / 100 / 60)
  )
  const seconds = new Intl.NumberFormat('ja', numberFormatOptions).format(
    Math.floor((vpos / 100) % 60)
  )

  const result = [minutes, seconds]

  if (shouldMSec) {
    const milliseconds = new Intl.NumberFormat(
      'ja',
      numberFormatOptions
    ).format(Math.floor(vpos % 100))
    result.push(milliseconds)
  }

  if (type === 'array') {
    return result
  } else if (shouldMSec) {
    return `${result[0]}:${result[1]}.${result[2]}`
  } else {
    return result.join(':')
  }
}
