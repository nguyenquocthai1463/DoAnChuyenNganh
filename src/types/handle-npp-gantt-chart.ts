import { ProcessResponse } from "./process";

const handleNPPGanttChart = (processes: ProcessResponse[] | undefined, priorities: number[]) => {
    processes = processes?.sort((p1, p2) => p1.id - p2.id);
    const n = processes ? processes.length : 0;
    const timeChart = [];

    let currentTime = 0;
    let remainingTime = processes && processes.map(p => p.burstTime);
    let completedProcesses = 0;
    let lastProcess = -1;

    while (completedProcesses < n) {
        let index = -1;
        let minPriority = Infinity;

        processes?.forEach((p, i) => {
            if (p.arrivalTime <= currentTime && (remainingTime && remainingTime[i] > 0)) {
                if (priorities[i] < minPriority || (priorities[i] === minPriority && remainingTime[i] < remainingTime[index])) {
                    index = i;
                    minPriority = priorities[i];
                }
            }
        });

        if (index === -1) {
            currentTime++;
            continue;
        }

        if (lastProcess !== index) {
            timeChart.push({
                id: processes && processes[index].id,
                startTime: currentTime,
            });
            lastProcess = index;
        }

        if (remainingTime)
            remainingTime[index] -= 1;
        currentTime++;

        if (remainingTime && remainingTime[index] === 0) {
            timeChart[timeChart.length - 1].endTime = currentTime;
            completedProcesses++;
        }
    }

    console.log(timeChart);

    return timeChart;
}

export default handleNPPGanttChart;