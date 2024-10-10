import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";
import { validateArrivalTimeAndBurstTime } from "@/types/data-validation";

const validateRequestData = (arrArrivalTime: any, arrBurstTime: any, quantum: any, res: NextApiResponse<ResponseData>) => {
    if (!Array.isArray(arrArrivalTime) || arrArrivalTime.length === 0 ||
        !Array.isArray(arrBurstTime) || arrBurstTime.length === 0 ||
        !quantum || (quantum && quantum <= 0) || typeof quantum !== 'number')
        return res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: "Invalid request. Please provide an array of process requests and a quantum positive number.",
            data: undefined,
        });

    validateArrivalTimeAndBurstTime(arrArrivalTime, arrBurstTime, undefined, res);
}

const roundRobinAlgo = (req: ProcessRequest): ResponseData => {
    // Declaration
    let tg_cho = new Array<number>(100);
    let tg_hoantat = new Array<number>(100);
    let tamTT = new Array<number>(100);
    let tamDen = new Array<number>(100);
    let tgxl = new Array<number>(100);
    let tg_den = new Array<number>(100);
    let tien_trinh_nghi = new Array<number>(100).fill(0);
    let tt = new Array<number>(100);
    let vtcu = new Array<number>(100);
    let sl_tt: number;
    let quantum: number;
    let sl: number;

    const xoa = (vt: number) => {
        let i = vt;
        while (i < sl) {
            tamTT[i] = tamTT[i + 1];
            tamDen[i] = tamDen[i + 1];
            vtcu[i] = vtcu[i + 1];
            i++;
        }
        sl--;
    }

    const chen = (vt: number, gt: number, gtden: number, gtvtcu: number) => {
        let i;
        for (i = sl; i > vt; i--) {
            tamTT[i] = tamTT[i - 1];
            tamDen[i] = tamDen[i - 1];
            vtcu[i] = vtcu[i - 1];
        }

        tamTT[vt] = gt;
        tamDen[vt] = gtden;
        vtcu[vt] = gtvtcu;
        sl++;
    }

    // Initialization
    sl_tt = req.arrPro.length;
    tt = req.arrPro.map((_item, index) => index + 1);
    tg_den = req.arrArrivalTime;
    tamDen = [...tg_den];
    tgxl = req.arrBurstTime;
    tamTT = [...tgxl];
    tg_cho = [...Array(sl_tt)].fill(0);
    tg_hoantat = [...Array(sl_tt)].fill(0);
    quantum = req.quantum ? req.quantum : 0;

    let tg_ht_tb = 0;
    let tg_cho_tb = 0;
    tg_cho[0] = 0;
    let i, tong_tg_chay = 0;

    for (i = 0; i < sl_tt; i++) {
        let j = i + 1;
        while (j < sl_tt) {
            if (tg_den[i] > tg_den[j]) {
                let t = tg_den[i];
                tg_den[i] = tg_den[j];
                tg_den[j] = t;
                t = tgxl[i];
                tgxl[i] = tgxl[j];
                tgxl[j] = t;
                t = tt[i];
                tt[i] = tt[j];
                tt[j] = t;
                tien_trinh_nghi[i] = 0;
            }
            j++;
        }
        vtcu[i] = i;
        tamTT[i] = tgxl[i];
        tamDen[i] = tg_den[i];
    }

    sl = sl_tt;
    let k = 0;

    while (sl > 0) {
        tg_cho[vtcu[0]] += (tong_tg_chay - tamDen[0] - tien_trinh_nghi[vtcu[0]]);
        tamDen[0] = 0;

        if (tamTT[0] > quantum) {
            tong_tg_chay += quantum;
            tien_trinh_nghi[vtcu[0]] = tong_tg_chay;
            tamTT[0] -= quantum;
            k = 1;
            while (tamDen[k] < tong_tg_chay && k < sl)
                k++;
            if (tamDen[k] != tong_tg_chay) {
                k = sl;
            }
            chen(k, tamTT[0], tamDen[0], vtcu[0]);
            xoa(0);
        }
        else {
            tong_tg_chay += tamTT[0];
            tg_cho_tb += tg_cho[vtcu[0]];
            tg_hoantat[vtcu[0]] = tong_tg_chay - tg_den[vtcu[0]];
            tg_ht_tb += tg_hoantat[vtcu[0]];
            xoa(0);
        }

        tg_cho_tb /= sl_tt;
        tg_ht_tb /= sl_tt;
    }

    return {
        statusCode: StatusCode.OK,
        message: undefined,
        data: {
            processes: tt.map((item, index) => {
                return {
                    id: item,
                    arrivalTime: tg_den[index],
                    burstTime: tgxl[index],
                    waitingTime: tg_cho[index],
                    finishTime: tg_hoantat[index]
                };
            }),
            averageFinishTime: tg_ht_tb,
            averageWaitingTime: tg_cho_tb
        }
    };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {

    if (req.method !== 'POST')
        return res.status(StatusCode.METHOD_NOT_ALLOWED).json({
            statusCode: StatusCode.METHOD_NOT_ALLOWED,
            message: "Method not allowed. Only POST method is supported.",
            data: undefined,
        });

    const { arrPro, arrArrivalTime, arrBurstTime, quantum } = req.body;
    validateRequestData(arrArrivalTime, arrBurstTime, quantum, res);

    const request: ProcessRequest = {
        arrPro: arrPro,
        arrArrivalTime: arrArrivalTime,
        arrBurstTime: arrBurstTime,
        arrPriority: undefined,
        quantum: quantum
    };

    const response: ResponseData = roundRobinAlgo(request);
    return res.status(StatusCode.OK).json(response);
}
