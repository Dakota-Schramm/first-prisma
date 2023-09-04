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
      console.debug(`[${currentLogLevel}] `, message, ...optionalParams)
    }
  },
  info: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.INFO) {
      console.info(`[${currentLogLevel}] `, message, ...optionalParams)
    }
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(`[${currentLogLevel}] `, message, ...optionalParams)
    }
  },
  error: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(`[${currentLogLevel}] `, message, ...optionalParams)
    }
  },
  fatal: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.FATAL) {
      console.error(`[${currentLogLevel}] `, message, ...optionalParams)
    }
  },
  unknown: (message?: any, ...optionalParams: any[]) => {
    if (currentLogLevel <= LogLevel.UNKNOWN) {
      console.log(`[${currentLogLevel}] `, message, ...optionalParams)
    }
  },
}

export default log;
