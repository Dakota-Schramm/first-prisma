export default function log(message: string) {
  if (process.env.NODE_ENV === 'production') return
  console.log(message)
}
