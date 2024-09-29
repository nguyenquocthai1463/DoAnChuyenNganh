"use client";
import { useState } from "react";

export default function Home() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("fcfs");
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [burstTime, setBurstTime] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [timeQuantum, setTimeQuantum] = useState<string>("");

  const handleSubmit = () => {
    // Xử lý dữ liệu khi bấm nút Submit
    if (selectedAlgorithm === "fcfs") {
      // Xử lý cho thuật toán FCFS
    }
    if (selectedAlgorithm === "sjf") {
      // Xử lý cho thuật toán SJF
    }
    if (selectedAlgorithm === "srtf") {
      // Xử lý cho thuật toán SRTF
    }
    if (selectedAlgorithm === "rr") {
      // Xử lý cho thuật toán RR
    }
    if (selectedAlgorithm === "npp") {
      // Xử lý cho thuật toán NPP
    }
    if (selectedAlgorithm === "pp") {
      // Xử lý cho thuật toán PP
    }
  }
    return (
      <main className="flex p-8 gap-8 row-start-1 max-h-32 sm:items-start">
        <div className="flex-auto flex flex-col p-4">
          <h1 className="text-xl text-white text-center pb-8 sm:text-4xl font-bold">
            CPU SCHEDULING VISUALIZER
          </h1>
          <div className="max-h-full p-5 block rounded-3xl bg-white max-w-full container">
            <h1 className="text-xl sm:text-xl text-black font-bold">OUTPUT</h1>
            <h2 className="text-black font-bold">Table will be shown here ...</h2>
          </div>
        </div>
        <div className="flex-auto p-6 rounded-3xl h-full block bg-white max-w-sm container px-6">
          <h3>Algorithm</h3>
          <select
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
          >
            <option value="fcfs">First Come First Serve, FCFS</option>
            <option value="sjf">Shortest Job First, SJF (Non Preemptive)</option>
            <option value="srtf">Shortest Remaining Time First, SRTF</option>
            <option value="rr">Round Robin, RR</option>
            <option value="npp">Priority, NPP (Non Preemptive)</option>
            <option value="pp">Priority, PP (Preemptive)</option>
          </select>
          {selectedAlgorithm && (
            <div>
              {selectedAlgorithm === "fcfs" && <div><h3>Arrival Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
                <h3>Burst Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                /></div>}
              {selectedAlgorithm === "sjf" && <div><h3>Arrival Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
                <h3>Burst Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                /></div>}
              {selectedAlgorithm === "srtf" && <div><h3>Arrival Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
                <h3>Burst Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                /></div>}
              {selectedAlgorithm === "rr" && <div><h3>Arrival Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
                <h3>Burst Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                />
                <h3>Time Quantum</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 3"
                  value={timeQuantum}
                  onChange={(e) => setTimeQuantum(e.target.value)}
                />
              </div>}
              {selectedAlgorithm === "npp" && <div><h3>Arrival Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
                <h3>Burst Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                />
                <h3>Priority</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="Lower #= Higher"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>}
              {selectedAlgorithm === "pp" && <div><h3>Arrival Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
                <h3>Burst Time</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="eg: 1 4 5 6"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                />
                <h3>Priority</h3>
                <input
                  type="text"
                  className="block w-full p-4 my-4 border border-gray-300 rounded-3xl"
                  placeholder="Lower #= Higher"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                /></div>}
            </div>
          )}
          <button 
            onClick={handleSubmit}
            className="block w-full p-3 mt-6 mb-2 bg-red-800 text-white rounded-xl">
            Submit
          </button>
        </div>
      </main>
    );
  }