import './global.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RRGanttChart = (props: any) => {
    const { processes } = props;

    const totalDuration = processes[processes.length - 1].endTime;

    return (
        <div className="gantt-chart">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {processes.map((process: any) => (
            <div
              key={process.id}
              className={
                "gantt-bar" + ` P${process.id}`
              }
              style={{
                width: `${(process.endTime - process.startTime) / totalDuration * 100}%`,
              }}
            >
              <span>P{process.id}</span>
              <span className="time-label">
                {process.startTime}-{process.endTime}
              </span>
            </div>
          ))}
        </div>
    );
}


export default RRGanttChart;