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
    let soTT: number;
    let tg_xuly = new Array<number>(100);
    let tg_denRL = new Array<number>(100);
    let tam = new Array<number>(100);
    let thoigian: number;
    let dem = 0;
    let nhonhat: number;
    let ketthuc: number;
    let tgcho = 0;
    let tght = 0;
    let tg_cho_tb = 0;
    let tg_hoantat_tb = 0;

    soTT = req.arrArrivalTime.length;
    tg_xuly = [...req.arrBurstTime]; // Sử dụng spread operator để sao chép mảng
    tg_denRL = [...req.arrArrivalTime]; // Sử dụng spread operator để sao chép mảng
    tam = [...req.arrBurstTime]; // Sao chép thời gian xử lý ban đầu

    for (thoigian = 0; dem !== soTT; thoigian++) {
        nhonhat = -1; // Khởi tạo nhonhat là -1
        for (let i = 0; i < soTT; i++) {
            if (tg_denRL[i] <= thoigian && (nhonhat === -1 || tg_xuly[i] < tg_xuly[nhonhat]) && tg_xuly[i] > 0) {
                nhonhat = i; // Cập nhật chỉ số của tiến trình nhỏ nhất
            }
        }
        if (nhonhat !== -1) { // Kiểm tra nhonhat có hợp lệ không
            tg_xuly[nhonhat]--;
            if (tg_xuly[nhonhat] === 0) {
                dem++;
                ketthuc = thoigian + 1;
                tgcho += ketthuc - tg_denRL[nhonhat] - tam[nhonhat];
                tght += ketthuc - tg_denRL[nhonhat];
            }
        }
    }

    tg_cho_tb = dem > 0 ? tgcho / dem : 0; // Kiểm tra dem > 0 trước khi chia
    tg_hoantat_tb = dem > 0 ? tght / dem : 0; // Kiểm tra dem > 0 trước khi chia

    return {
        statusCode: StatusCode.OK,
        message: undefined,
        data: {
            processes: req.arrArrivalTime.map((item, index) => {
                return {
                    id: index + 1,
                    arrivalTime: tg_denRL[index],
                    burstTime: tam[index],
                    finishTime: item,
                    waitingTime: item
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
