// types/process.d.ts
export interface ProcessRequest {
    arrPro: number[];
    arrArrivalTime: number[];
    arrBurstTime: number[];
    arrPriority?: number[];
    quantum?: number;
}

export interface ProcessResponse {
    id: number;
    arrivalTime: number;
    burstTime: number;
    finishTime: number;
    waitingTime: number;
}

export interface ProcessResult {
    processes: ProcessResponse[];
    averageWaitingTime: number;
    averageFinishTime: number;
}