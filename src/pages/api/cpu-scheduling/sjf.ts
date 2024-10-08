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
    return {
        statusCode: StatusCode.OK,
        message: undefined,
        data: {
            processes: req.arrArrivalTime.map((item, index) => {
                return {
                    id: index + 1,
                    arrivalTime: item,
                    burstTime: req.arrBurstTime[index],
                    finishTime: 0,
                    waitingTime: 0
                };
            }),
            averageFinishTime: 0,
            averageWaitingTime: 0
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

    const { arrArrivalTime, arrBurstTime } = req.body;
    validateRequestData(arrArrivalTime, arrBurstTime, res);

    const request: ProcessRequest = {
        arrArrivalTime: arrArrivalTime,
        arrBurstTime: arrBurstTime,
        arrPriority: undefined,
        quantum: undefined
    };

    const response: ResponseData = shortestJobFirstAlgo(request);
    return res.status(StatusCode.OK).json(response);
}
