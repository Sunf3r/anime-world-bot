import { RawRESTRequest } from "eris";
import KetClient from "../KetClient";
const moment = require('moment');

module.exports = class RawRESTEvent {
    ket: KetClient;
    constructor(ket: KetClient) {
        this.ket = ket;
    }
    async start(req: RawRESTRequest) {
        if (req.resp.statusCode === 429 || req.resp.headers['x-ratelimit-scope']) {
            let rl = this.ket.requestHandler.ratelimits[req.route],
                timeout = moment.duration(Date.now() - rl.reset).format(" dd[D] hh[H] mm[M] ss[S] S[MS]");

            console.log(`${String(req.resp.headers['x-ratelimit-scope']).toUpperCase()} RATE LIMIT/${timeout}`, `${rl.limit} ${req.method}S em ${req.route}`)
        }
    }
}