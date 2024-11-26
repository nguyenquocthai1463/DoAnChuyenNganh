import { ProcessResponse } from "./process";

const handlePPGanttChart = (processes: ProcessResponse[] | undefined, priorities: number[]) => {
    processes = processes?.sort((p1, p2) => p1.id - p2.id);
    processes = processes?.map((p, index) => {
        return { ...p, priority: priorities[index] };
    });
    const n = processes ? processes.length : 0;
    const timeChart = [];

    processes?.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime: number = 0;
    let completedProcesses = 0;
    const isCompleted = Array(n).fill(false);

    while (completedProcesses < n) {
        let index = -1;
        let minPriority = Infinity;

        processes?.forEach((p, i) => {
            if (p.arrivalTime <= currentTime && !isCompleted[i]) {
                if (p.priority < minPriority) {
                    minPriority = p.priority;
                    index = i;
                } else if (p.priority === minPriority && p.arrivalTime < processes[index].arrivalTime) {
                    index = i;
                }
            }
        });

        if (index !== -1) {
            const startTime: number = currentTime;
            const endTime: number = startTime + (processes ? processes[index].burstTime : 0);

            timeChart.push({
                id: processes && processes[index].id,
                startTime,
                endTime,
            });

            currentTime = endTime;
            isCompleted[index] = true;
            completedProcesses++;
        } else {
            if (processes)
                currentTime = Number((processes && processes.find((_p, index) => !isCompleted[index]))?.arrivalTime);
        }
    }

    return timeChart;
}

export default handlePPGanttChart;