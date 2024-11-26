import './global.css';

const RRGanttChart = (props: any) => {
    const { processes } = props;

    const totalDuration = processes[processes.length - 1].endTime;

    return (
        <div className="gantt-chart">
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