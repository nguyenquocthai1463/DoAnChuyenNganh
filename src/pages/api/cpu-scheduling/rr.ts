import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest, ProcessResponse, ProcessResult } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const request: ProcessRequest[] = req.body;
        const response: ResponseData = {
            statusCode: StatusCode.OK,
            message: undefined,
            data: {
                processes: request.map(item => {
                    return {
                        id: item.process.id,
                        arrivalTime: item.process.arrivalTime,
                        burstTime: item.process.burstTime,
                        finishTime: 0,
                        waitingTime: 0
                    };
                }),
                averageFinishTime: 0,
                averageWaitingTime: 0
            },
        };
        return res.status(200).json(response);
    }
    const error: ResponseData = {
        statusCode: StatusCode.METHOD_NOT_ALLOWED,
        message: "Method not allowed. Only POST method is supported.",
        data: undefined,
    };
    return res.status(StatusCode.METHOD_NOT_ALLOWED).json(error);
}
