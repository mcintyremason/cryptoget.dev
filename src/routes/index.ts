import { Router } from "express";
import { healthCheck } from "src/routes/Health/Health";
import { web3Check } from "src/routes/Web3/Web3";

// Health route(s)
const healthRouter = Router();
healthRouter.get("/", healthCheck);

// Web3 route(s)
const web3Router = Router();
web3Router.get("/", web3Check);

// Export the base-router
const baseRouter = Router();
baseRouter.use("/health", healthRouter);
baseRouter.use("/web3", web3Router);
export default baseRouter;
