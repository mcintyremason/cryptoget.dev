import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
const cc = require("cryptocompare");
global.fetch = require("node-fetch");

const { OK } = StatusCodes;

export const cryptoHealthCheck = async (req: Request, res: Response) => {
  const response = {
    status: "OK",
  };
  return res.status(OK).json({ response });
};

export const balanceTotals = async (req: Request, res: Response) => {
  const jsonObj = req.body;

  const cryptoNamesArr = [];

  for (const key of Object.keys(jsonObj.currencies)) {
    cryptoNamesArr.push(jsonObj.currencies[key].name);
  }

  try {
    const prices = await cc.priceMulti(cryptoNamesArr, "USD");

    for (const key of Object.keys(prices)) {
      jsonObj.currencies[key].price = prices[key].USD;
      jsonObj.currencies[key].total =
        jsonObj.currencies[key].holdings * prices[key].USD;
      jsonObj.total += jsonObj.currencies[key].total;
    }

    return res.status(OK).json(jsonObj);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
};
