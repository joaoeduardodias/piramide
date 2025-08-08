import dayjs from 'dayjs'

export const isNewProduct = (createdAt: string) => {
  const created = dayjs(createdAt)
  return dayjs().diff(created, 'hour') < 48
}