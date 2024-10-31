import { ProcessResponse } from "@/types/process";
import './global.css';

const SJFPGanttChart = (props: any) => {

    const { processes } = props;

    processes.sort((p1: ProcessResponse, p2: ProcessResponse) => p1.waitingTime - p2.waitingTime);
    
    const totalDuration = processes[processes.length - 1.].finishTime;

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


export default SJFPGanttChart;