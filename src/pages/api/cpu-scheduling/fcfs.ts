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
const firstComeFirstServeAlgo = (req: ProcessRequest): ResponseData => {
    let sl_tt: number;
    const tg_cho = new Array<number>(100);
    let tg_xuly = new Array<number>(100);
    const tg_hoantat = new Array<number>(100);
    let tg_cho_tb = 0;
    let tg_hoantat_tb = 0;
    sl_tt = req.arrBurstTime.length;
    tg_xuly = req.arrBurstTime


    tg_cho[0] = 0;
    for (let i = 1; i < sl_tt; i++) {
        tg_cho[i] = 0;
        for (let j = 0; j < i; j++) {
            tg_cho[i] += tg_xuly[j]
        }
    }

    for (let i = 0; i < sl_tt; i++) {
        tg_hoantat[i] = tg_xuly[i] + tg_cho[i];
        tg_cho_tb += tg_cho[i];
        tg_hoantat_tb += tg_hoantat[i];
    }
    tg_cho_tb /= sl_tt;
    tg_hoantat_tb /= sl_tt;
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

    const response: ResponseData = firstComeFirstServeAlgo(request);
    return res.status(StatusCode.OK).json(response);
}
