enum LogLevel {
  DEBUG, 
  INFO,
  WARN,
  ERROR,
  FATAL, 
  UNKNOWN
}

const currentLogLevel = (process.env.NODE_ENV !== 'production')
  ? LogLevel.DEBUG
  : LogLevel.WARN

const log = {
  currentLevel: currentLogLevel,
  debug: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.DEBUG) console.debug(message, ...optionalParams)
  },
  info: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.INFO) console.info(message, ...optionalParams)
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.WARN) console.warn(message, ...optionalParams)
  },
  error: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.ERROR) console.error(message, ...optionalParams)
  },
  fatal: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.FATAL) console.error(message, ...optionalParams)
  },
  unknown: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.UNKNOWN) console.log(message, ...optionalParams)
  },
}

export default log;
