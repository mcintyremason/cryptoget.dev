import StatusCodes from 'http-status-codes'
import { Request, Response } from 'express'
import { BalanceTotalsResponse, CryptoListData } from './types/Cryptocompare'
import { sortObjectByKeys } from 'shared/functions'
const cc = require('cryptocompare')
global.fetch = require('node-fetch')

const { OK } = StatusCodes

export const cryptoHealthCheck = async (req: Request, res: Response) => {
  const response = {
    status: 'OK',
  }
  return res.status(OK).json({ response })
}

export const getBalanceTotals = async (req: Request, res: Response) => {
  const balanceTotalsQuery = req.query
  const cryptoNamesArr = []
  const cryptoBalances: BalanceTotalsResponse = {
    currencies: {},
    total: 0,
  }

  try {
    for (const key of Object.keys(balanceTotalsQuery)) {
      cryptoNamesArr.push(key)
      cryptoBalances.currencies = {
        ...cryptoBalances.currencies,
        ...{ [key]: { symbol: key, holdings: 0 } },
      }
      cryptoBalances.currencies[key].holdings = parseFloat(balanceTotalsQuery[key] as string) || 0
    }

    const prices = await cc.priceMulti(cryptoNamesArr, 'USD')

    for (const key of Object.keys(prices)) {
      cryptoBalances.currencies[key].price = prices[key].USD
      cryptoBalances.currencies[key].total =
        (cryptoBalances.currencies[key].holdings as number) * prices[key].USD
      cryptoBalances.total += cryptoBalances.currencies[key].total as number
    }
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
  return res.status(OK).json({ ...cryptoBalances })
}

export const getCryptoList = async (req: Request, res: Response) => {
  let sortedReducedCryptos = {}

  try {
    let cryptoSymbols = {}
    let reducedCryptos = {}
    const coinListResponse = await cc.coinList()

    cryptoSymbols = { ...coinListResponse.Data }

    const reduceFields = (cryptoData: CryptoListData) => {
      return Object.entries(cryptoData).reduce((acc, [key, value]) => {
        switch (key) {
          case 'FullName':
            return { ...acc, ...{ [key]: value } }
          case 'Symbol':
            return { ...acc, ...{ [key]: value } }
          default:
            return acc
        }
      }, {})
    }

    for (const entry of Object.entries(cryptoSymbols)) {
      const [key, value] = entry
      const reducedCrypto = {
        [key]: reduceFields(value as CryptoListData),
      }
      reducedCryptos = { ...reducedCryptos, ...reducedCrypto }
    }

    sortedReducedCryptos = sortObjectByKeys(reducedCryptos)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
  return res.status(OK).json(sortedReducedCryptos)
}
