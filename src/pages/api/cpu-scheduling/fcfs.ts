import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";


const firstComeFirstServeAlgo = (req: ProcessRequest): ResponseData => {
    let TG_XuLy = new Array<number>(100).fill(0);
    const TG_Cho = new Array<number>(100).fill(0);
    const TG_HoanTat = new Array<number>(100).fill(0);
    let TG_Cho_TB: number = 0.0;
    let TG_HoanTat_TB: number = 0.0;
    let count: number;
    let j: number;
    const So_TienTrinh: number = req.arrPro.length;
    TG_XuLy = req.arrBurstTime;
    TG_Cho[0] = 0;
    for (count = 1; count < So_TienTrinh; count++) {
        TG_Cho[count] = 0;
        for (j = 0; j < count; j++) {
            TG_Cho[count] = TG_Cho[count] + TG_XuLy[j];
        }
    }
    for (count = 0; count < So_TienTrinh; count++) {
        TG_HoanTat[count] = TG_XuLy[count] + TG_Cho[count];
        TG_Cho_TB = TG_Cho_TB + TG_Cho[count];
        TG_HoanTat_TB = TG_HoanTat_TB + TG_HoanTat[count];
    }
    TG_Cho_TB = TG_Cho_TB / count;
    TG_HoanTat_TB = TG_HoanTat_TB / count;
    return {
        statusCode: StatusCode.OK,
        message: undefined,
        data: {
            processes: req.arrPro.map((item, index) => {
                return {
                    id: item,
                    arrivalTime: req.arrArrivalTime[index],
                    burstTime: TG_XuLy[index],
                    finishTime: TG_HoanTat[index],
                    waitingTime: TG_Cho[index],
                    priority: 0
                };
            }),
            averageFinishTime: TG_HoanTat_TB,
            averageWaitingTime: TG_Cho_TB,
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
    const { arrPro, arrArrivalTime, arrBurstTime } = req.body;
    try {
        const request: ProcessRequest = {
            arrPro: arrPro,
            arrArrivalTime: arrArrivalTime.map(Number),
            arrBurstTime: arrBurstTime.map(Number),
            arrPriority: undefined,
            quantum: undefined
        };
        const response: ResponseData = firstComeFirstServeAlgo(request);
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
