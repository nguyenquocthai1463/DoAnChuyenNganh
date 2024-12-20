import { NextApiRequest, NextApiResponse } from "next";
import { ProcessRequest } from "@/types/process";
import { StatusCode } from "@/types/status-code";
import { ResponseData } from "@/types/api-response";


const shortestJobFirstPreemitiveAlgo = (req: ProcessRequest): ResponseData => {
  let tam: number, i: number, j: number, soTT: number = 0, vitri: number, tong: number = 0;
  let tgchotb: number = 0, tghttb: number = 0;
  let tgxl = new Array<number>(100).fill(0);
  let tt = new Array<number>(100).fill(0);
  const tgcho = new Array<number>(100).fill(0);
  const tght = new Array<number>(100).fill(0);
  soTT = req.arrPro.length;
  tgxl = req.arrBurstTime;
  tt = req.arrPro;
  for (i = 0; i < soTT; i++) {
    vitri = i;
    for (j = i + 1; j < soTT; j++) {
      if (tgxl[j] < tgxl[vitri]) {
        vitri = j;
      }
    }
    tam = tgxl[i];
    tgxl[i] = tgxl[vitri];
    tgxl[vitri] = tam;
    tam = tt[i];
    tt[i] = tt[vitri];
    tt[vitri] = tam;
  }
  tgcho[0] = 0;
  for (i = 1; i < soTT; i++) {
    tgcho[i] = 0;
    for (j = 0; j < i; j++) {
      tgcho[i] = tgcho[i] + tgxl[j];
    }
    tong = tong + tgcho[i];
  }
  tgchotb = tong / soTT;

  tong = 0;
  for (i = 0; i < soTT; i++) {
    tght[i] = tgxl[i] + tgcho[i];
    tong = tong + tght[i];
  }
  tghttb = tong / soTT;

  return {
    statusCode: StatusCode.OK,
    message: undefined,
    data: {
      processes: tt.map((item, index) => {
        return {
          id: item,
          arrivalTime: req.arrArrivalTime[index],
          burstTime: tgxl[index],
          finishTime: tght[index],
          waitingTime: tgcho[index],
          priority: 0
        };
      }),
      averageFinishTime: tghttb,
      averageWaitingTime: tgchotb,
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

    const response: ResponseData = shortestJobFirstPreemitiveAlgo(request);
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
