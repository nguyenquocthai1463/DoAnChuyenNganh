import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";
import {
    validateTheLengthOfProcesses,
    validateArrivalTimeBurstTimeAndPriority,
    validateThatEachElementInTheProcessesIsNumeric
} from "@/types/data-validation";



const priorityNonPreemitiveAlgo = (req: ProcessRequest): ResponseData => {
    let tg_denRL = new Array<number>(100).fill(0);
    let tg_xuly = new Array<number>(100).fill(0);
    const tg_cho = new Array<number>(100).fill(0);
    const tg_hoantat = new Array<number>(100).fill(0);
    let do_uu_tien = new Array<number>(100).fill(0);
    let i: number;
    let tam = new Array<number>(100).fill(0);
    let dem: number = 0;
    let uu_tien_nho: number;
    let t: number;
    let TongTG_cho: number = 0;
    let TongTG_hoantat: number = 0;
    let tg_cho_tb: number = 0;
    let tg_hoantat_tb: number = 0;
    const sotientrinh: number = req.arrPro.length;
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
                    waitingTime: tg_cho[index],
                    priority: do_uu_tien[index]
                };
            }),
            averageFinishTime: tg_hoantat_tb,
            averageWaitingTime: tg_cho_tb
        },
    };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {

    if (req.method !== 'POST') {
        res.status(StatusCode.METHOD_NOT_ALLOWED).json({
            statusCode: StatusCode.METHOD_NOT_ALLOWED,
            message: "Method not allowed. Only POST method is supported.",
            data: undefined,
        });
        return;
    }

    const { arrPro, arrArrivalTime, arrBurstTime, arrPriority } = req.body;

    try {
        if (!validateTheLengthOfProcesses(arrArrivalTime, arrBurstTime)) {
            res.status(StatusCode.BAD_REQUEST).json({
                statusCode: StatusCode.BAD_REQUEST,
                message: `Please provide an array of processes as well as corresponding arrival and burst times.`,
                data: undefined,
            });
            return;
        }

        if (!validateArrivalTimeBurstTimeAndPriority(arrArrivalTime, arrBurstTime, arrPriority)) {
            res.status(StatusCode.BAD_REQUEST).json({
                statusCode: StatusCode.BAD_REQUEST,
                message: `The length of arrival times, burst times, and priorities should be the same.`,
                data: undefined,
            });
            return;
        }

        const ans = validateThatEachElementInTheProcessesIsNumeric(arrArrivalTime, arrBurstTime, arrPriority);
        if (!ans[0]) {
            res.status(StatusCode.BAD_REQUEST).json({
                statusCode: StatusCode.BAD_REQUEST,
                message: ans[1],
                data: undefined,
            });
            return;
        }

        const request: ProcessRequest = {
            arrPro: arrPro,
            arrArrivalTime: arrArrivalTime.map(Number),
            arrBurstTime: arrBurstTime.map(Number),
            arrPriority: arrPriority.map(Number),
            quantum: undefined
        };

        const response: ResponseData = priorityNonPreemitiveAlgo(request);
        res.status(StatusCode.OK).json(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(StatusCode.SERVER_ERROR).json({
            statusCode: StatusCode.SERVER_ERROR,
            message: error.message,
            data: undefined,
        });
    }
}
