import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest, ProcessResponse } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";
import { validateArrivalTimeAndBurstTime } from "@/types/data-validation";

const validateRequestData = (arrArrivalTime: any, arrBurstTime: any, arrPriority: any, res: NextApiResponse<ResponseData>) => {
    if (!Array.isArray(arrArrivalTime) || arrArrivalTime.length === 0 ||
        !Array.isArray(arrBurstTime) || arrBurstTime.length === 0 ||
        !Array.isArray(arrPriority) || arrPriority.length === 0)
        return res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: "Invalid request. Please provide an array of process requests.",
            data: undefined,
        });

    validateArrivalTimeAndBurstTime(arrArrivalTime, arrBurstTime, arrPriority, res);
}

const priorityNonPreemitiveAlgo = (req: ProcessRequest): ResponseData => {
    let tg_denRL = new Array<number>(100).fill(0);
    let tg_xuly = new Array<number>(100).fill(0);
    let tg_cho = new Array<number>(100).fill(0);
    let tg_hoantat = new Array<number>(100).fill(0);
    let do_uu_tien = new Array<number>(100).fill(0);
    let i: number;
    let sotientrinh: number;
    let tam = new Array<number>(100).fill(0);
    let dem: number = 0;
    let uu_tien_nho: number;
    let t: number;
    let TongTG_cho: number = 0;
    let TongTG_hoantat: number = 0;
    let tg_cho_tb: number;
    let tg_hoantat_tb: number;

    sotientrinh = req.arrPro.length;
    tg_denRL = req.arrArrivalTime;
    tg_xuly = [...req.arrBurstTime];
    do_uu_tien = req.arrPriority ? req.arrPriority : [];
    tam = [...tg_xuly];

    do_uu_tien[9] = 5000;

    for (t = 0; dem != sotientrinh; t++) {
        uu_tien_nho = 9;
        for (i = 0; i < sotientrinh; i++) {
            if (do_uu_tien[uu_tien_nho] > do_uu_tien[i] && tg_denRL[i] <= t && tg_xuly[i] > 0) {
                uu_tien_nho = i;
            }
        }

        tg_xuly[uu_tien_nho] = tg_xuly[uu_tien_nho] - 1;

        if (tg_xuly[uu_tien_nho] == 0) {
            dem++;
            tg_cho[uu_tien_nho] = t + 1 - tg_denRL[uu_tien_nho] - tam[uu_tien_nho];
            tg_hoantat[uu_tien_nho] = t + 1 - tg_denRL[uu_tien_nho];

            TongTG_cho = TongTG_cho + tg_cho[uu_tien_nho];
            TongTG_hoantat = TongTG_hoantat + tg_hoantat[uu_tien_nho];
        }
    }

    tg_cho_tb = TongTG_cho / sotientrinh;
    tg_hoantat_tb = TongTG_hoantat / sotientrinh;

    return {
        statusCode: StatusCode.OK,
        message: undefined,
        data: {
            processes: req.arrPro.map((item, index) => {
                return {
                    id: item,
                    arrivalTime: tg_denRL[index],
                    burstTime: req.arrBurstTime[index],
                    finishTime: tg_hoantat[index],
                    waitingTime: tg_cho[index]
                };
            }),
            averageFinishTime: tg_hoantat_tb,
            averageWaitingTime: tg_cho_tb
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

    const { arrPro, arrArrivalTime, arrBurstTime, arrPriority } = req.body;
    validateRequestData(arrArrivalTime, arrBurstTime, arrPriority, res);

    const request: ProcessRequest = {
        arrPro: arrPro,
        arrArrivalTime: arrArrivalTime,
        arrBurstTime: arrBurstTime,
        arrPriority: arrPriority,
        quantum: undefined
    };

    const response: ResponseData = priorityNonPreemitiveAlgo(request);
    return res.status(StatusCode.OK).json(response);
}
