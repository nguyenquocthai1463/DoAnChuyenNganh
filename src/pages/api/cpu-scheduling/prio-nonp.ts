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
    const tam = [...req.arrBurstTime]; // sao chép mảng tg_xuly ban đầu
    const sotientrinh: number = req.arrArrivalTime.length;
    let dem = 0;
    let t = 0;
    let TongTG_cho = 0;
    let TongTG_hoantat = 0;
    const tg_cho = new Array<number>(100);
    const tg_hoantat = new Array<number>(100);
    const do_uu_tien = new Array<number>(100);
    const tg_denRL = [...req.arrArrivalTime];
    const tg_xuly = [...req.arrBurstTime];
    let tg_cho_tb = 0;
    let tg_hoantat_tb = 0;

    for (t = 0; dem !== sotientrinh; t++) {
        let uu_tien_nho = -1;
        for (let i = 0; i < sotientrinh; i++) {
            if (tg_denRL[i] <= t && tg_xuly[i] > 0) {
                if (do_uu_tien[uu_tien_nho] === -1 || tg_denRL[i] < tg_denRL[uu_tien_nho]) {
                    uu_tien_nho = i;
                }
            }
        }

        if (uu_tien_nho !== -1) {
            tg_xuly[uu_tien_nho]--;
            if (tg_xuly[uu_tien_nho] === 0) {
                dem++;
                tg_cho[uu_tien_nho] = t + 1 - tg_denRL[uu_tien_nho] - tam[uu_tien_nho];
                tg_hoantat[uu_tien_nho] = t + 1 - tg_denRL[uu_tien_nho];
                TongTG_cho += tg_cho[uu_tien_nho];
                TongTG_hoantat += tg_hoantat[uu_tien_nho];
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tg_cho_tb = dem > 0 ? TongTG_cho / dem : 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tg_hoantat_tb = dem > 0 ? TongTG_hoantat / dem : 0;

    return {
        statusCode: StatusCode.OK,
        message: undefined,
        data: {
            processes: req.arrArrivalTime.map((item, index) => {
                return {
                    id: index + 1,
                    arrivalTime: tg_denRL[index],
                    burstTime: tam[index],
                    finishTime: tg_hoantat[index],
                    waitingTime: tg_cho[index],
                };
            }),
            averageFinishTime: tg_cho_tb,
            averageWaitingTime: tg_hoantat_tb
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
