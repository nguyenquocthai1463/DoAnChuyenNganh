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

const shortestRemainingTimeFirstAlgo = (req: ProcessRequest): ResponseData => {
    let tgdenRL = new Array<number>(100).fill(0);
    let tgxl = new Array<number>(100).fill(0);
    let tam = new Array<number>(100).fill(0);
    let i: number;
    let nhonhat: number;
    let dem: number = 0;
    let thoigian: number;
    let soTT: number;
    let tgcho: number = 0;
    let tght: number = 0;
    let ketthuc: number;
    let tgchotb: number, tghttb: number;


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
            tgcho = tgcho + ketthuc - tgdenRL[nhonhat] - tam[nhonhat];
            tght = tght + ketthuc - tgdenRL[nhonhat];
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
                    finishTime: tght,
                    waitingTime: tgcho
                };
            }),
            averageFinishTime: tghttb,
            averageWaitingTime: tgchotb
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

    const response: ResponseData = shortestRemainingTimeFirstAlgo(request);
    return res.status(StatusCode.OK).json(response);
}
