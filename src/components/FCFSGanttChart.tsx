import { ProcessResponse } from "@/types/process";
import './global.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FCFSGanttChart = (props: any) => {
  const { processes } = props;

  const totalDuration = processes[processes.length - 1].finishTime;

  return (
    <div className="gantt-chart">
      {processes.map((process: ProcessResponse) => (
        <div
          key={process.id}
          className={
            "gantt-bar" + ` P${process.id}`
          }
          style={{
            width: `${(process.finishTime - process.waitingTime) / totalDuration * 100}%`,
          }}
        >
          <span>P{process.id}</span>
          <span className="time-label">
            {process.waitingTime}-{process.finishTime}
          </span>
        </div>
      ))}
    </div>
  );
}


export default FCFSGanttChart;