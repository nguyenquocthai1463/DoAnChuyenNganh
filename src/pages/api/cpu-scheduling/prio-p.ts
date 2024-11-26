import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";
import {
  validateTheLengthOfProcesses,
  validateArrivalTimeBurstTimeAndPriority,
  validateThatEachElementInTheProcessesIsNumeric
} from "@/types/data-validation";


const priorityPreemitiveAlgo = (req: ProcessRequest): ResponseData => {
  let ma_tt = new Array<number>(100).fill(0);
  let tg_denRL = new Array<number>(100).fill(0);
  let tg_xuly = new Array<number>(100).fill(0);
  const tg_cho = new Array<number>(100).fill(0);
  const tg_hoantat = new Array<number>(100).fill(0);
  let do_uu_tien = new Array<number>(100).fill(0);
  let i: number, j: number, sotientrinh: number = 0;
  let kiemtra_tg_denRL: number = 0;
  let tg_tra_CPU: number = 0;
  let TongTG_cho = 0, TongTG_hoantat = 0, tg_cho_tb = 0, tg_hoantat_tb = 0;

  sotientrinh = req.arrPro.length;
  ma_tt = req.arrPro;
  tg_denRL = req.arrArrivalTime;
  tg_xuly = req.arrBurstTime;
  do_uu_tien = req.arrPriority ? req.arrPriority : [];

  for (i = 0; i < sotientrinh; i++) {
    // Kiem tra thoi gian den hang doi cua tien trinh: cung nhau hoac khac nhau 
    if (i == 0)
      kiemtra_tg_denRL = tg_denRL[i];

    if (kiemtra_tg_denRL != tg_denRL[i])
      kiemtra_tg_denRL = 1;
  }

  // Neu tien trinh den hang doi voi thoi gian khac nhau thi sap xep cac tien trinh dua tren thoi gian den
  if (kiemtra_tg_denRL != 0) {
    for (i = 0; i < sotientrinh; i++) {
      for (j = 0; j < sotientrinh - i - 1; j++) {
        if (tg_denRL[i] > tg_denRL[j + 1]) {
          [ma_tt[j], ma_tt[j + 1]] = [ma_tt[j + 1], ma_tt[j]];
          [tg_denRL[j], tg_denRL[j + 1]] = [tg_denRL[j + 1], tg_denRL[j]];
          [tg_xuly[j], tg_xuly[j + 1]] = [tg_xuly[j + 1], tg_xuly[j]];
          [do_uu_tien[j], do_uu_tien[j + 1]] = [do_uu_tien[j + 1], do_uu_tien[j]];
        }
      }
    }
  }

  // Neu tat ca tien trinh den Ready List voi thoi gian khac nhau
  if (kiemtra_tg_denRL != 0) {
    tg_cho[0] = tg_denRL[0];
    tg_hoantat[0] = tg_xuly[0] - tg_denRL[0];
    // cmp_time for completion time
    tg_tra_CPU = tg_hoantat[0];
    TongTG_cho = TongTG_cho + tg_cho[0];
    TongTG_hoantat = TongTG_hoantat + tg_hoantat[0];

    for (i = 1; i < sotientrinh; i++) {
      let min = do_uu_tien[i];
      for (j = i + 1; j < sotientrinh; j++) {
        if (min > do_uu_tien[j] && tg_denRL[j] <= tg_tra_CPU) {
          min = do_uu_tien[j];
          [ma_tt[i], ma_tt[j]] = [ma_tt[j], ma_tt[i]];
          [tg_denRL[i], tg_denRL[j]] = [tg_denRL[j], tg_denRL[i]];
          [tg_xuly[i], tg_xuly[j]] = [tg_xuly[j], tg_xuly[i]];
          [do_uu_tien[i], do_uu_tien[j]] = [do_uu_tien[j], do_uu_tien[i]];
        }
      }
      tg_cho[i] = tg_tra_CPU - tg_denRL[i];
      TongTG_cho = TongTG_cho + tg_cho[i];
      // Thoi gian hoan thanh cua tien trinh
      tg_tra_CPU = tg_tra_CPU + tg_xuly[i];

      // Thoi gian hoan tat cua tien trinh (hoan thanh - thoi gian den Ready List)
      tg_hoantat[i] = tg_tra_CPU - tg_denRL[i];
      TongTG_hoantat = TongTG_hoantat + tg_hoantat[i];
    }
  }
  else { // Neu tat ca tien trinh den cung thoi gian
    for (i = 0; i < sotientrinh; i++) {
      let min = do_uu_tien[i];
      for (j = i + 1; j < sotientrinh; j++) {
        if (min > do_uu_tien[j] && tg_denRL[j] <= tg_tra_CPU) {
          min = do_uu_tien[j];
          [ma_tt[i], ma_tt[j]] = [ma_tt[j], ma_tt[i]];
          [tg_denRL[i], tg_denRL[j]] = [tg_denRL[j], tg_denRL[i]];
          [tg_xuly[i], tg_xuly[j]] = [tg_xuly[j], tg_xuly[i]];
          [do_uu_tien[i], do_uu_tien[j]] = [do_uu_tien[j], do_uu_tien[i]];
        }
      }
      tg_cho[i] = tg_tra_CPU - tg_denRL[i];

      // Thoi gian hoan thanh cua tien trinh
      tg_tra_CPU = tg_tra_CPU + tg_xuly[i];

      // Thoi gian hoan tat cua tien trinh
      tg_hoantat[i] = tg_tra_CPU - tg_denRL[i];
      TongTG_cho = TongTG_cho + tg_cho[i];
      TongTG_hoantat = TongTG_hoantat + tg_hoantat[i];
    }
  }

  tg_cho_tb = TongTG_cho / sotientrinh;
  tg_hoantat_tb = TongTG_hoantat / sotientrinh;

  return {
    statusCode: StatusCode.OK,
    message: undefined,
    data: {
      processes: ma_tt.map((item, index) => {
        return {
          id: item,
          arrivalTime: tg_denRL[index],
          burstTime: tg_xuly[index],
          finishTime: tg_hoantat[index],
          waitingTime: tg_cho[index],
          priority: do_uu_tien[index]
        };
      }),
      averageFinishTime: tg_hoantat_tb,
      averageWaitingTime: tg_cho_tb,
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

    const response: ResponseData = priorityPreemitiveAlgo(request);
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
