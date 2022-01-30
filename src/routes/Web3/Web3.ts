import Web3 from 'web3'
import StatusCodes from 'http-status-codes'
import { Request, Response } from 'express'

const { OK } = StatusCodes

const web3 = new Web3('ws://localhost:8545')

export async function healthCheck(req: Request, res: Response) {
  const response = {
    status: 'OK',
  }
  return res.status(OK).json({ response })
}

export async function web3Check(req: Request, res: Response) {
  console.log(web3)

  return res.status(OK).json(web3)
}
