import { ProcessResult } from "./process";

export interface ResponseData {
    statusCode: number;
    message?: string;
    data?: ProcessResult;
}