import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";
import {
    validateTheLengthOfProcesses,
    validateArrivalTimeAndBurstTime,
    validateThatEachElementInTheProcessesIsNumeric
} from "@/types/data-validation";


const shortestJobFirstNonPreemitiveAlgo = (req: ProcessRequest): ResponseData => {
    let tgdenRL = new Array<number>(100).fill(0);
    let tgxl = new Array<number>(100).fill(0);
    let tam = new Array<number>(100).fill(0);
    const tg_cho = new Array<number>(100).fill(0);
    const tg_ht = new Array<number>(100).fill(0);
    let i: number;
    let nhonhat: number;
    let dem: number = 0;
    let thoigian: number;
    let soTT: number = 0;
    let tgcho: number = 0;
    let tght: number = 0;
    let ketthuc: number;
    let tgchotb: number = 0, tghttb: number = 0;
    soTT = req.arrPro.length;
    tgdenRL = req.arrArrivalTime;
    tgxl = [...req.arrBurstTime];
    tam = [...tgxl];
    tgxl[9] = 60;
    for (thoigian = 0; dem != soTT; thoigian++) {
        nhonhat = 9;
        for (i = 0; i < soTT; i++) {
            if (tgdenRL[i] <= thoigian && tgxl[i] < tgxl[nhonhat] && tgxl[i] > 0) {
                nhonhat = i;
            }
        }
        tgxl[nhonhat]--;
        if (tgxl[nhonhat] == 0) {
            dem++;
            ketthuc = thoigian + 1;
            tg_cho[nhonhat] = ketthuc - tgdenRL[nhonhat] - tam[nhonhat];
            tg_ht[nhonhat] = ketthuc - tgdenRL[nhonhat];
            tgcho = tgcho + tg_cho[nhonhat];
            tght = tght + tg_ht[nhonhat];
        }
    }
    tgchotb = tgcho / soTT;
    tghttb = tght / soTT;

    return {
        statusCode: StatusCode.OK,
        message: undefined,
        data: {
            processes: req.arrPro.map((item, index) => {
                return {
                    id: item,
                    arrivalTime: tgdenRL[index],
                    burstTime: req.arrBurstTime[index],
                    finishTime: tg_ht[index],
                    waitingTime: tg_cho[index],
                    priority: 0
                };
            }),
            averageFinishTime: tghttb,
            averageWaitingTime: tgchotb
        }
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

    const { arrPro, arrArrivalTime, arrBurstTime } = req.body;

    try {
        if (!validateTheLengthOfProcesses(arrArrivalTime, arrBurstTime)) {
            res.status(StatusCode.BAD_REQUEST).json({
                statusCode: StatusCode.BAD_REQUEST,
                message: `Please provide an array of processes as well as corresponding arrival and burst times.`,
                data: undefined,
            });
            return;
        }

        if (!validateArrivalTimeAndBurstTime(arrArrivalTime, arrBurstTime)) {
            res.status(StatusCode.BAD_REQUEST).json({
                statusCode: StatusCode.BAD_REQUEST,
                message: `The length of arrival times and burst times should be the same.`,
                data: undefined,
            });
            return;
        }

        const ans = validateThatEachElementInTheProcessesIsNumeric(arrArrivalTime, arrBurstTime, undefined);
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
            arrPriority: undefined,
            quantum: undefined
        };

        const response: ResponseData = shortestJobFirstNonPreemitiveAlgo(request);
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
