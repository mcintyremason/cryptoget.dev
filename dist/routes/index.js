"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Health_1 = require("./Health/Health");
const Web3_1 = require("./Web3/Web3");
// Health route(s)
const healthRouter = (0, express_1.Router)();
healthRouter.get("/", Health_1.healthCheck);
// Web3 route(s)
const web3Router = (0, express_1.Router)();
web3Router.get("/", Web3_1.web3Check);
// Export the base-router
const baseRouter = (0, express_1.Router)();
baseRouter.use("/health", healthRouter);
baseRouter.use("/web3", web3Router);
exports.default = baseRouter;
