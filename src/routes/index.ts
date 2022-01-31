import { Router } from 'express'
import { healthCheck } from './Health/Health'
import { web3Check } from './Web3/Web3'
import { cryptoHealthCheck, getBalanceTotals, getCryptoList } from './Cryptocompare/Cryptocompare'

// Health route(s)
const healthRouter = Router()
healthRouter.get('/', healthCheck)

// Web3 route(s)
const web3Router = Router()
web3Router.get('/', web3Check)

// Cryptocompare route(s)
const cryptocompareRouter = Router()
cryptocompareRouter.get('/health', cryptoHealthCheck)
cryptocompareRouter.get('/balance-totals', getBalanceTotals)
cryptocompareRouter.get('/get-crypto-list', getCryptoList)

// Export the base-router
const baseRouter = Router()
baseRouter.use('/health', healthRouter)
baseRouter.use('/web3', web3Router)
baseRouter.use('/crypto', cryptocompareRouter)
export default baseRouter
