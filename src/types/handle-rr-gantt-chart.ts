import { ProcessResponse } from "./process";

const handleRRGanttChart = (processes: ProcessResponse[] | undefined, pQuantum: number) => {
    let tg_cho = new Array<number>(100);
    let tg_hoantat = new Array<number>(100);
    let tamTT: number[] | undefined = new Array<number>(100);
    let tamDen: number[] | undefined = new Array<number>(100);
    let tgxl: number[] | undefined = new Array<number>(100);
    let tg_den: number[] | undefined = new Array<number>(100);
    const tien_trinh_nghi = new Array<number>(100).fill(0);
    let tt: number[] | undefined = new Array<number>(100);
    const vtcu = new Array<number>(100);
    let sl_tt: number = 0;
    let quantum: number = 0;
    let sl: number = 0;

    const ganttChart = [] as { id: number | undefined; startTime: number; endTime: number }[];

    const xoa = (vt: number) => {
        let i = vt;
        while (tamTT && tamDen && i < sl) {
            tamTT[i] = tamTT[i + 1];
            tamDen[i] = tamDen[i + 1];
            vtcu[i] = vtcu[i + 1];
            i++;
        }
        sl--;
    };

    const chen = (vt: number, gt: number, gtden: number, gtvtcu: number) => {
        let i;
        for (i = sl; i > vt && tamTT && tamDen; i--) {
            tamTT[i] = tamTT[i - 1];
            tamDen[i] = tamDen[i - 1];
            vtcu[i] = vtcu[i - 1];
        }
        if (tamTT && tamDen) {
            tamTT[vt] = gt;
            tamDen[vt] = gtden;
        }
        vtcu[vt] = gtvtcu;
        sl++;
    };

    // Initialization
    processes = processes && processes.sort(p => p.id);
    sl_tt = processes ? processes.length : 0;
    tt = processes && processes.map(p => p.id);
    tg_den = processes && processes.map(p => p.arrivalTime);
    tamDen = tg_den && [...tg_den];
    tgxl = processes && processes.map(p => p.burstTime);
    tamTT = tgxl && [...tgxl];
    tg_cho = [...Array(sl_tt)].fill(0);
    tg_hoantat = [...Array(sl_tt)].fill(0);
    quantum = pQuantum;

    let tg_ht_tb = 0;
    let tg_cho_tb = 0;
    tg_cho[0] = 0;
    let i, tong_tg_chay = 0;

    for (i = 0; i < sl_tt; i++) {
        let j = i + 1;
        while (j < sl_tt) {
            if (tg_den && tgxl && tt && tg_den[i] > tg_den[j]) {
                let t = tg_den[i];
                tg_den[i] = tg_den[j];
                tg_den[j] = t;
                t = tgxl[i];
                tgxl[i] = tgxl[j];
                tgxl[j] = t;
                t = tt[i];
                tt[i] = tt[j];
                tt[j] = t;
                tien_trinh_nghi[i] = 0;
            }
            j++;
        }
        vtcu[i] = i;
        if (tamDen && tamTT && tg_den && tgxl) {
            tamTT[i] = tgxl[i];
            tamDen[i] = tg_den[i];
        }
    }

    sl = sl_tt;
    let k = 0;

    while (sl > 0) {
        const start = tong_tg_chay;

        if (tamDen) {
            tg_cho[vtcu[0]] += (tong_tg_chay - tamDen[0] - tien_trinh_nghi[vtcu[0]]);
            tamDen[0] = 0;
        }

        if (tamTT && tamTT[0] > quantum) {
            tong_tg_chay += quantum;
            tien_trinh_nghi[vtcu[0]] = tong_tg_chay;
            tamTT[0] -= quantum;
            k = 1;
            while (tamDen && tamDen[k] < tong_tg_chay && k < sl)
                k++;
            if (tamDen && tamDen[k] != tong_tg_chay) {
                k = sl;
            }
            if (tamDen)
                chen(k, tamTT[0], tamDen[0], vtcu[0]);

            ganttChart.push({ id: tt && tt[vtcu[0]], startTime: start, endTime: tong_tg_chay }); // Lưu lịch sử
            xoa(0);
        }
        else {
            if (tamTT && tg_den) {
                tong_tg_chay += tamTT[0];
                tg_cho_tb += tg_cho[vtcu[0]];
                tg_hoantat[vtcu[0]] = tong_tg_chay - tg_den[vtcu[0]];
                tg_ht_tb += tg_hoantat[vtcu[0]];
            }
            
            ganttChart.push({ id: tt && tt[vtcu[0]], startTime: start, endTime: tong_tg_chay }); // Lưu lịch sử
            xoa(0);
        }

        tg_cho_tb /= sl_tt;
        tg_ht_tb /= sl_tt;
    }

    console.log(tg_cho_tb, tg_ht_tb);

    return ganttChart;
}

export default handleRRGanttChart;