const moment = require('moment')

function parseTime(time) {
  const fragments = time.split(':')
  return {
    hours: parseInt(fragments[0] || 0),
    minutes: parseInt(fragments[1] || 0),
    seconds: parseInt(fragments[2] || 0)
  }
}

function getTimeObject(time) {
  if (typeof time === 'object' && 'hours' in time && 'minutes' in time && 'seconds' in time) {
    return time
  }
  return new Time(time)
}

class Time {
  constructor(hours, minutes, seconds) {
    if (typeof hours === 'string') {
      const parsed = parseTime(hours)
      this.hours = parsed.hours
      this.minutes = parsed.minutes
      this.seconds = parsed.seconds
      return
    }
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
  }

  manipulateSeconds(manipulator) {
    let seconds = (this.seconds + manipulator) % 60
    const minutes = Math.floor((this.seconds + manipulator) / 60)
    this.manipulateMinutes(minutes)
    seconds = seconds < 0 ? seconds + 60 : seconds
    this.seconds = seconds
  }

  manipulateMinutes(manipulator) {
    let minutes = (this.minutes + manipulator) % 60
    const hours = Math.floor((this.minutes + manipulator) / 60)
    this.manipulateHours(hours)
    minutes = minutes < 0 ? minutes + 60 : minutes
    this.minutes = minutes
  }

  manipulateHours(manipulator) {
    this.hours = this.hours + manipulator
  }

  add(time) {
    const timeObj = getTimeObject(time)
    this.manipulateSeconds(timeObj.seconds)
    this.manipulateMinutes(timeObj.minutes)
    this.manipulateHours(timeObj.hours)
  }

  substract(time) {
    const timeObj = getTimeObject(time)
    this.manipulateSeconds(-timeObj.seconds)
    this.manipulateMinutes(-timeObj.minutes)
    this.manipulateHours(-timeObj.hours)
  }

  toString() {
    const hours = this.hours < 10 ? '0' + this.hours : this.hours
    const minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes
    const seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds
    return `${hours}:${minutes}:${seconds}`
  }
}

let args = process.argv.slice(2)

if (args[0].match(/[+-]/)) {
  args = args[0].split(/([+-])/)
}

if (args.length < 3) {
  console.error('You must supply at least 3 parameters')
}

if (!(args.length % 2)) {
  console.error('Number of parameters must be odd')
}

const startTime = new Time(args[0])
const timeOperations = args.slice(1)

for (let i = 0; i < timeOperations.length; i = i + 2) {
  const operator = timeOperations[i]
  const time = new Time(timeOperations[i + 1])

  if (operator === '+') {
    startTime.add(time)
    continue
  }

  if (operator === '-') {
    startTime.substract(time)
    continue
  }

  return console.error('Unsupported operator')
}

console.log(startTime.toString())