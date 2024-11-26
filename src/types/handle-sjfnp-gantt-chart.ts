import { ProcessResponse } from "./process";

const handleSJFNPGanttChart = (processes: ProcessResponse[] | undefined) => {

  let currentTime = 0;
  let completedProcesses = 0;
  const timeChart = [];
  const remainingTime = processes && processes.map(p => p.burstTime);
  const n = processes ? processes.length : 0;

  while (completedProcesses < n) {
    const availableProcesses = processes && processes
      .map((p: ProcessResponse, index: number) => ({ ...p, index }))
      .filter(p => p.arrivalTime <= currentTime && (remainingTime && remainingTime[p.index] > 0));

    if (availableProcesses && availableProcesses.length > 0) {
      availableProcesses.sort((a, b) => {
        if (remainingTime)
            return remainingTime[a.index] - remainingTime[b.index];
        return 0;
      });
      const process = availableProcesses[0];
      const index = process.index;

      if (
        timeChart.length === 0 ||
        timeChart[timeChart.length - 1].id !== process.id
      ) {
        timeChart.push({
          id: process.id,
          startTime: currentTime,
          endTime: 0
        });
      }

      if (remainingTime) remainingTime[index]--

      currentTime++;

      timeChart[timeChart.length - 1].endTime = currentTime;

      if (remainingTime && remainingTime[index] === 0) {
        completedProcesses++;
      }
    } else {
      currentTime++;
    }
  }

    return timeChart;
}

export default handleSJFNPGanttChart;