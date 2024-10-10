import { NextApiResponse } from "next";
import { ResponseData } from "./api-response";
import { StatusCode } from "./status-code";

const validateArrivalTimeAndBurstTime = (arrArrivalTime: any, arrBurstTime: any, arrPriority: any, res: NextApiResponse<ResponseData>) => {
    if (arrArrivalTime.length !== arrBurstTime.length)
        return res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: "Invalid request. The number of arrival times and burst times should be the same.",
            data: undefined,
        });

    if (typeof arrPriority !== 'undefined' &&
        (arrArrivalTime.length !== arrPriority.length || arrBurstTime.length !== arrPriority.length))
        return res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: "Invalid request. The number of arrival times, burst times, and priorities should be the same.",
            data: undefined,
        });

    for (let i = 0; i < arrArrivalTime.length; i++) {
        if (typeof arrArrivalTime[i] !== 'number' || arrArrivalTime[i] < 0 ||
            typeof arrBurstTime[i] !== 'number' || arrBurstTime[i] < 0)
            return res.status(StatusCode.BAD_REQUEST).json({
                statusCode: StatusCode.BAD_REQUEST,
                message: "Invalid process data: arrivalTime and burstTime should be positive numbers.",
                data: undefined,
            });
    }
}

export { validateArrivalTimeAndBurstTime };