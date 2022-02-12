import { Request, Response } from 'express'
import StatusCodes from 'http-status-codes'
import { camelize, sortObjectByFullName } from 'shared/functions'
import { BalanceTotalsResponse, CryptoListData, ReducedCryptoListData } from './types/Cryptocompare'
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

export const getReducedCryptoList = async (req: Request, res: Response) => {
  let sortedReducedCryptos = {}

  try {
    let cryptoSymbols = {}
    const reducedCryptos: any[] = []
    const coinListResponse = await cc.coinList()

    cryptoSymbols = { ...coinListResponse.Data }

    // Reduce original response to fields we care about in the FE app
    const reduceFields = (cryptoData: CryptoListData): ReducedCryptoListData => {
      return Object.entries(cryptoData).reduce((acc, [key, value]) => {
        switch (key) {
          case 'FullName':
            return { ...acc, ...{ [camelize(key)]: value } }
          case 'Symbol':
            return { ...acc, ...{ [camelize(key)]: value } }
          case 'TotalCoinsMined':
            return { ...acc, ...{ [camelize(key)]: value } }
          default:
            return acc
        }
      }, {}) as ReducedCryptoListData
    }

    // create object of reduced values for cryptos
    for (const entry of Object.entries(cryptoSymbols)) {
      const [key, value] = entry
      const reducedCrypto = reduceFields(value as CryptoListData)

      if (reducedCrypto?.totalCoinsMined > 10000000) {
        reducedCryptos.push(reducedCrypto)
      }
    }

    sortedReducedCryptos = sortObjectByFullName(reducedCryptos)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
  return res.status(OK).json(sortedReducedCryptos)
}
