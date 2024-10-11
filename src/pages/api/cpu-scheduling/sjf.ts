import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest, ProcessResponse } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";
import { validateArrivalTimeAndBurstTime } from "@/types/data-validation";

const validateRequestData = (arrArrivalTime: any, arrBurstTime: any, res: NextApiResponse<ResponseData>) => {
    if (!Array.isArray(arrArrivalTime) || arrArrivalTime.length === 0 ||
        !Array.isArray(arrBurstTime) || arrBurstTime.length === 0)
        return res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: "Invalid request. Please provide an array of process requests.",
            data: undefined,
        });

    validateArrivalTimeAndBurstTime(arrArrivalTime, arrBurstTime, undefined, res);
}

const shortestJobFirstAlgo = (req: ProcessRequest): ResponseData => {
    let tam: number;
    let tong = 0;
    let vitri: number;
    const tt: number[] = [];
    let soTT: number;
    let tg_xuly = new Array<number>(100);
    const tg_cho = new Array<number>(100);
    const tg_hoantat = new Array<number>(100);
    let tg_cho_tb = 0;
    let tg_hoantat_tb = 0;
    tg_xuly = req.arrBurstTime;

    soTT = req.arrBurstTime.length;
    for (let i = 0; i < soTT; i++) {
      vitri = i;
      for (let j = i + 1; j < soTT; j++) {
        if (tg_xuly[j] < tg_xuly[vitri]) {
          vitri = j;
        }
      }
      tam = tg_xuly[i];
      tg_xuly[i] = tg_xuly[vitri];
      tg_xuly[vitri] = tam;
      tam = tt[i];
      tt[i] = tt[vitri];
      tt[vitri] = tam;
    }

    tg_cho[0] = 0;
    for (let i = 1; i < soTT; i++) {
      tg_cho[i] = 0;
      for (let j = 0; j < i; j++) {
        tg_cho[i] += tg_xuly[j];
      }
      tong += tg_cho[i];
    }
    tg_cho_tb = tong / soTT;
    tong = 0;
    for (let i = 0; i < soTT; i++) {
      tg_hoantat[i] = tg_xuly[i] + tg_cho[i];
      tong += tg_hoantat[i];
    }
    tg_hoantat_tb = tong / soTT;
    return {
        statusCode: StatusCode.OK,
        message: undefined,
        data: {
            processes: req.arrArrivalTime.map((item, index) => {
                return {
                    id: index + 1,
                    arrivalTime: item,
                    burstTime: tg_xuly[index],
                    finishTime: tg_hoantat[index],
                    waitingTime: tg_cho[index],
                };
            }),
            averageFinishTime: tg_hoantat_tb,
            averageWaitingTime: tg_cho_tb,
        },
    };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {

    if (req.method !== 'POST')
        return res.status(StatusCode.METHOD_NOT_ALLOWED).json({
            statusCode: StatusCode.METHOD_NOT_ALLOWED,
            message: "Method not allowed. Only POST method is supported.",
            data: undefined,
        });

    const { arrPro, arrArrivalTime, arrBurstTime } = req.body;
    validateRequestData(arrArrivalTime, arrBurstTime, res);

    const request: ProcessRequest = {
        arrPro: arrPro,
        arrArrivalTime: arrArrivalTime,
        arrBurstTime: arrBurstTime,
        arrPriority: undefined,
        quantum: undefined
    };

    const response: ResponseData = shortestJobFirstAlgo(request);
    return res.status(StatusCode.OK).json(response);
}
