import { useMemo, useState } from "react";

export default function App() {
  const [processes, setProcesses] = useState([
    { pid: "P1", arrival: 0, burst: 5 },
    { pid: "P2", arrival: 1, burst: 3 },
    { pid: "P3", arrival: 2, burst: 8 },
  ]);
  const [algorithm, setAlgorithm] =
    useState("FCFS");

  function addProcess() {
    const newProcess = {
      pid: `P${processes.length + 1}`,
      arrival: 0,
      burst: 1,
    };

    setProcesses([...processes, newProcess]);
  }

  function updateProcess(index, field, value) {
    const updatedProcesses = [...processes];

    updatedProcesses[index][field] =
      field === "pid" ? value : Number(value);

    setProcesses(updatedProcesses);
  }

  function runFCFS(processes) {
    const sorted = [...processes].sort(
      (a, b) => a.arrival - b.arrival
    );

    let currentTime = 0;
    const ganttChart = [];

    const calculatedResults =
      sorted.map((process) => {
        const startTime = Math.max(
          currentTime,
          process.arrival
        );

        const completionTime =
          startTime + process.burst;

        ganttChart.push({
          pid: process.pid,
          start: startTime,
          end: completionTime,
        });

        const turnaroundTime =
          completionTime - process.arrival;

        const waitingTime =
          turnaroundTime - process.burst;

        currentTime = completionTime;

        return {
          ...process,
          startTime,
          completionTime,
          turnaroundTime,
          waitingTime,
        };
      });

    return {
      calculatedResults,
      ganttChart,
    };
  }

  function runSJF(processes) {
    const remaining = [...processes];

    const completed = [];

    const result = [];

    const ganttChart = [];

    let currentTime = 0;

    while (completed.length < processes.length) {
      const available = remaining
        .filter(
          (p) =>
            !completed.includes(p.pid) &&
            p.arrival <= currentTime
        )
        .sort((a, b) => a.burst - b.burst);

      if (available.length === 0) {
        currentTime++;
        continue;
      }

      const process = available[0];

      const startTime = currentTime;

      const completionTime =
        startTime + process.burst;

      const turnaroundTime =
        completionTime - process.arrival;

      const waitingTime =
        turnaroundTime - process.burst;

      ganttChart.push({
        pid: process.pid,
        start: startTime,
        end: completionTime,
      });

      result.push({
        ...process,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
      });

      completed.push(process.pid);

      currentTime = completionTime;
    }

    return {
      calculatedResults: result,
      ganttChart,
    };
  }


  const {
    calculatedResults,
    ganttChart,
  } = useMemo(() => {
    if (algorithm === "FCFS") {
      return runFCFS(processes);
    }

    if (algorithm === "SJF") {
      return runSJF(processes);
    }

    return runFCFS(processes);
  }, [processes, algorithm]);

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>CPU Scheduling Visualizer</h1>

      <button
        onClick={addProcess}
        style={{
          marginBottom: "20px",
          padding: "10px",
        }}
      >
        Add Process
      </button>

      <div style={{ marginBottom: "20px" }}>
        <label>Algorithm: </label>

        <select
          value={algorithm}
          onChange={(e) =>
            setAlgorithm(e.target.value)
          }
        >
          <option value="FCFS">
            FCFS
          </option>

          <option value="SJF">
            SJF
          </option>
        </select>
      </div>

      <h2>Processes</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>PID</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
          </tr>
        </thead>

        <tbody>
          {processes.map((p, index) => (
            <tr key={p.pid}>
              <td>
                <input
                  value={p.pid}
                  onChange={(e) =>
                    updateProcess(
                      index,
                      "pid",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={p.arrival}
                  onChange={(e) =>
                    updateProcess(
                      index,
                      "arrival",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={p.burst}
                  onChange={(e) =>
                    updateProcess(
                      index,
                      "burst",
                      e.target.value
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>
        {algorithm} Results
      </h2>
      
      <h2 style={{ marginTop: "30px" }}>
        Gantt Chart
      </h2>

      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        {ganttChart.map((block) => (
          <div
            key={block.pid + block.start}
            style={{
              border: "1px solid black",
              padding: "20px",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            <div>{block.pid}</div>

            <div style={{ marginTop: "10px" }}>
              {block.start} - {block.end}
            </div>
          </div>
        ))}
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>PID</th>
            <th>Start</th>
            <th>Completion</th>
            <th>Turnaround</th>
            <th>Waiting</th>
          </tr>
        </thead>

        <tbody>
          {calculatedResults.map((p) => (
            <tr key={p.pid}>
              <td>{p.pid}</td>
              <td>{p.startTime}</td>
              <td>{p.completionTime}</td>
              <td>{p.turnaroundTime}</td>
              <td>{p.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}