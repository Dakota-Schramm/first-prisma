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
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.debug(`[${LogLevel[currentLogLevel]}]`, message, ...optionalParams)
    }
  },
  info: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.INFO) {
      console.info(`[${LogLevel[currentLogLevel]}]`, message, ...optionalParams)
    }
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(`[${LogLevel[currentLogLevel]}]`, message, ...optionalParams)
    }
  },
  error: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(`[${LogLevel[currentLogLevel]}]`, message, ...optionalParams)
    }
  },
  fatal: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.FATAL) {
      console.error(`[${LogLevel[currentLogLevel]}]`, message, ...optionalParams)
    }
  },
  unknown: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.UNKNOWN) {
      console.log(`[${LogLevel[currentLogLevel]}]`, message, ...optionalParams)
    }
  },
}

export default log;
