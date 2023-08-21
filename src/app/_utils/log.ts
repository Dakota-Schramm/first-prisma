export default function log(message?: any, ...optionalParams: any[]) {
  if (process.env.NODE_ENV === 'production') return
  console.log(message, ...optionalParams)
}
