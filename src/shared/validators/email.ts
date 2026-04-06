export const email = (value: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(value)) {
    return 'Некорректный email'
  }
  return null
}
