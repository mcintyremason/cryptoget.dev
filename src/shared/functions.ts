import logger from './Logger'

export const pErr = (err: Error) => {
  if (err) {
    logger.err(err)
  }
}

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000)
}

export const sortObjectByKeys = (o: any) => {
  return Object.keys(o)
    .sort()
    .reduce((r: any, k) => ((r[k] = o[k]), r), {})
}
