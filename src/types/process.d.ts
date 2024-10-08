// types/process.d.ts
export interface ProcessRequest {
    process: {
        id: number;
        arrivalTime: number;
        burstTime: number;
        priority?: number;
    };
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