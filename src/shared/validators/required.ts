export const required = (value: string) => {
  if (value === null || value === undefined || value === '') {
    return 'Поле обязательно'
  }
  return null
}
