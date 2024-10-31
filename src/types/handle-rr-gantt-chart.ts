import { ProcessResponse } from "./process";

const handleRRGanttChart = (processes: ProcessResponse[] | undefined, quantum: number) => {
    const timeQuantum = quantum;
    const n = processes ? processes.length : 0;
    const timeChart = [];
    let currentTime = 0;
    let queue = [];
    const remainingTime = processes && processes.map(p => p.burstTime);
    let completedProcesses = 0;

    // Khởi tạo các tiến trình vào queue nếu có arrival time = 0
    processes?.forEach((p, index) => {
        if (p.arrivalTime <= currentTime) {
            queue.push(index);
        }
    });

    while (completedProcesses < n) {
        if (queue.length === 0) {
            if (processes) {
                currentTime = Math.min(...processes.map((p, i) => ((remainingTime && remainingTime[i] > 0) ? p.arrivalTime : Infinity)));
                processes?.forEach((p, index) => {
                    if (p.arrivalTime <= currentTime && (remainingTime && remainingTime[index] > 0) && !queue.includes(index)) {
                      queue.push(index);
                    }
                  });
                continue;
            }
        }

        const index = queue.shift();
        const process = processes && processes[index];
        const startTime = currentTime;

        let timeSlice;
        if (remainingTime) {
            timeSlice = Math.min(timeQuantum, remainingTime[index]);
            currentTime += timeSlice;
            remainingTime[index] -= timeSlice;
        }

        timeChart.push({
            id: process?.id,
            startTime: startTime,
            endTime: currentTime,
        });

        if (remainingTime && remainingTime[index] === 0) {
            completedProcesses++;
        } else {
            queue.push(index);
        }

        processes?.forEach((p, i) => {
            if (p.arrivalTime <= currentTime && (remainingTime && remainingTime[i] > 0) && !queue.includes(i)) {
                queue.push(i);
            }
        });
    }

    return timeChart;
}

export default handleRRGanttChart;