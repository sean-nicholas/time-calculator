function parseTime(time) {
  const fragments = time.split(':')
  return {
    hours: parseInt(fragments[0] || 0),
    minutes: parseInt(fragments[1] || 0),
    seconds: parseInt(fragments[2] || 0)
  }
}

function getTimeObject(time) {
  if (time instanceof Time) return time
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
    const hours = (this.hours < 10 && this.hour >= 0) ? '0' + this.hours : this.hours
    const minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes
    const seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds
    return `${hours}:${minutes}:${seconds}`
  }
}

function printUsage() {
  console.log('Usage: time-calculator [startTime] [operator] [manipulatorTime]')
  console.log('\t [startTime]: The time you start your calculation with')
  console.log('\t [operator]: + or -')
  console.log('\t [manipulatorTime]: Time you want to add or substract')
  console.log('Times can be written like: 1, 01, 01:30, 01:30:10. Be careful: 10:3 is not 10:30 but 10:03.')
  console.log('You can supply multiple [operator] [manipulatorTime] pairs after one another.')
  console.log('Example usages:')
  console.log('\t time-calculator 16 - 14:32:10')
  console.log('\t time-calculator 16 - 14:32:10 + 4 - 0:30:10')
  console.log('\t time-calculator 16-14:32:10')
  console.log('\t time-calculator 16-14:32:10+4-0:30:10')
}

// Remove node and index.js from args
let args = process.argv.slice(2)

if (!args.length) return printUsage()

// Support syntax without spaces
// For example: `time-calculator 16:00-12:30` instead of `time-calculator 16:00 - 12:30`
const operatorsRegex = /([+-])/
if (args[0].match(operatorsRegex)) {
  args = args[0].split(operatorsRegex)
}

if (args.length < 3) {
  console.error('You must supply at least 3 parameters')
  return printUsage()
}

if (!(args.length % 2)) {
  console.error('Number of parameters must be odd')
  return printUsage()
}

const time = new Time(args[0])
// Remove the starting time from the time manipulation operations
const timeOperations = args.slice(1)

for (let i = 0; i < timeOperations.length; i = i + 2) {
  const operator = timeOperations[i]
  const manipulatorTime = timeOperations[i + 1]

  if (operator === '+') {
    time.add(manipulatorTime)
    continue
  }

  if (operator === '-') {
    time.substract(manipulatorTime)
    continue
  }

  return console.error('Unsupported operator')
}

console.log(time.toString())