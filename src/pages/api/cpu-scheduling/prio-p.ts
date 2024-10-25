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

const priorityPreemitiveAlgo = (req: ProcessRequest): ResponseData => {
  function hoandoi(b: number, c: number): [number, number] {
    return [c, b];
  }
  let sotientrinh: number;
  sotientrinh = req.arrArrivalTime.length;
  const kiemtra_tg_den = 0;
  let tg_tra_CPU = 0;
  let TongTG_cho = 0;
  let TongTG_hoantat = 0;
  const tg_cho = new Array<number>(100);
  let tg_den = new Array<number>(100);
  let tg_xuly = new Array<number>(100);
  const ma_tt = new Array<number>(100);
  let do_uu_tien = new Array<number>(100);
  const tg_hoantat = new Array<number>(100);
  let tg_cho_tb = 0;
  let tg_hoantat_tb = 0;
  tg_xuly = req.arrBurstTime
  tg_den = req.arrArrivalTime
  do_uu_tien = req.arrPriority || []
  let tt = req.arrPro.map(item => item);

  if (kiemtra_tg_den !== 0) {
    for (let i = 0; i < sotientrinh; i++) {
      for (let j = 0; j < sotientrinh - i - 1; j++) {
        if (tg_den[j] > tg_den[j + 1]) {
          [ma_tt[j], ma_tt[j + 1]] = hoandoi(ma_tt[j], ma_tt[j + 1]);
          [tg_den[j], tg_den[j + 1]] = hoandoi(tg_den[j], tg_den[j + 1]);
          [tg_xuly[j], tg_xuly[j + 1]] = hoandoi(tg_xuly[j], tg_xuly[j + 1]);
          [do_uu_tien[j], do_uu_tien[j + 1]] = hoandoi(do_uu_tien[j], do_uu_tien[j + 1]);
        }
      }
    }
  }
  if (kiemtra_tg_den !== 0) {
    tg_cho[0] = tg_den[0];
    tg_hoantat[0] = tg_xuly[0] - tg_den[0];
    tg_tra_CPU = tg_hoantat[0];
    TongTG_cho += tg_cho[0];
    TongTG_hoantat += tg_hoantat[0];

    for (let i = 1; i < sotientrinh; i++) {
      let min = do_uu_tien[i];
      for (let j = i + 1; j < sotientrinh; j++) {
        if (min > do_uu_tien[j] && tg_den[j] <= tg_tra_CPU) {
          min = do_uu_tien[j];
          [ma_tt[i], ma_tt[j]] = hoandoi(ma_tt[i], ma_tt[j]);
          [tg_den[i], tg_den[j]] = hoandoi(tg_den[i], tg_den[j]);
          [tg_xuly[i], tg_xuly[j]] = hoandoi(tg_xuly[i], tg_xuly[j]);
          [do_uu_tien[i], do_uu_tien[j]] = hoandoi(do_uu_tien[i], do_uu_tien[j]);
        }
      }
      tg_cho[i] = tg_tra_CPU - tg_den[i];
      TongTG_cho += tg_cho[i];
      tg_tra_CPU += tg_xuly[i];
      tg_hoantat[i] = tg_tra_CPU - tg_den[i];
      TongTG_hoantat += tg_hoantat[i];
    }
  } else {
    for (let i = 0; i < sotientrinh; i++) {
      let min = do_uu_tien[i];
      for (let j = i + 1; j < sotientrinh; j++) {
        if (min > do_uu_tien[j] && tg_den[j] <= tg_tra_CPU) {
          min = do_uu_tien[j];
          [ma_tt[i], ma_tt[j]] = hoandoi(ma_tt[i], ma_tt[j]);
          [tg_den[i], tg_den[j]] = hoandoi(tg_den[i], tg_den[j]);
          [tg_xuly[i], tg_xuly[j]] = hoandoi(tg_xuly[i], tg_xuly[j]);
          [do_uu_tien[i], do_uu_tien[j]] = hoandoi(do_uu_tien[i], do_uu_tien[j]);
        }
      }
      tg_cho[i] = tg_tra_CPU - tg_den[i];
      tg_tra_CPU += tg_xuly[i];
      tg_hoantat[i] = tg_tra_CPU - tg_den[i];
      TongTG_cho += tg_cho[i];
      TongTG_hoantat += tg_hoantat[i];

      tg_cho_tb = TongTG_cho / sotientrinh;
      tg_hoantat_tb = TongTG_hoantat / sotientrinh;
    }
  }
  return {
    statusCode: StatusCode.OK,
    message: undefined,
    data: {
      processes: tt.map((item, index) => {
        return {
          id: item,
          arrivalTime: tg_den[index],
          burstTime: tg_xuly[index],
          finishTime: tg_hoantat[index],
          waitingTime: tg_cho[index],
        };
      }),
      averageFinishTime: tg_hoantat_tb,
      averageWaitingTime: tg_cho_tb,
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

  const response: ResponseData = priorityPreemitiveAlgo(request);
  return res.status(StatusCode.OK).json(response);
}
