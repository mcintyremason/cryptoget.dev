"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3Check = exports.healthCheck = void 0;
const web3_1 = __importDefault(require("web3"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { OK } = http_status_codes_1.default;
const web3 = new web3_1.default("ws://localhost:8545");
function healthCheck(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = {
            status: "OK",
        };
        return res.status(OK).json({ response });
    });
}
exports.healthCheck = healthCheck;
function web3Check(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(web3);
        return res.status(OK).json(web3);
    });
}
exports.web3Check = web3Check;
