"use client";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
interface TienTrinh {
  ma_tt: number;
  tg_cho: number;
  tg_denRL: number;
  tg_xuly: number;
  tg_hoantat: number;
  do_uu_tien: number;
}

const a: TienTrinh[] = [];

export default function Home() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("fcfs");
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [burstTime, setBurstTime] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [timeQuantum, setTimeQuantum] = useState<string>("");
  const [result, setResult] = useState<JSX.Element | null>(null);


  function hoandoi(b: number, c: number): [number, number] {
    return [c, b];
  }

  function pp() {
    let sotientrinh: number;
    let kiemtra_tg_denRL = 0;
    let tg_tra_CPU = 0;
    let TongTG_cho = 0;
    let TongTG_hoantat = 0;
    // let tg_cho_tb: number;
    // let tg_hoantat_tb: number;

    // eslint-disable-next-line prefer-const
    sotientrinh = 9;
    const tg_denRL = 0;
    const tg_xuly = 0;
    const do_uu_tien = 0;

    for (let i = 0; i < sotientrinh; i++) {
      a.push({ ma_tt: i + 1, tg_cho: 0, tg_denRL, tg_xuly, tg_hoantat: 0, do_uu_tien });

      if (i === 0) kiemtra_tg_denRL = a[i].tg_denRL;
      if (kiemtra_tg_denRL !== a[i].tg_denRL) kiemtra_tg_denRL = 1;
    }

    if (kiemtra_tg_denRL !== 0) {
      for (let i = 0; i < sotientrinh; i++) {
        for (let j = 0; j < sotientrinh - i - 1; j++) {
          if (a[j].tg_denRL > a[j + 1].tg_denRL) {
            [a[j].ma_tt, a[j + 1].ma_tt] = hoandoi(a[j].ma_tt, a[j + 1].ma_tt);
            [a[j].tg_denRL, a[j + 1].tg_denRL] = hoandoi(a[j].tg_denRL, a[j + 1].tg_denRL);
            [a[j].tg_xuly, a[j + 1].tg_xuly] = hoandoi(a[j].tg_xuly, a[j + 1].tg_xuly);
            [a[j].do_uu_tien, a[j + 1].do_uu_tien] = hoandoi(a[j].do_uu_tien, a[j + 1].do_uu_tien);
          }
        }
      }
    }
    if (kiemtra_tg_denRL !== 0) {
      a[0].tg_cho = a[0].tg_denRL;
      a[0].tg_hoantat = a[0].tg_xuly - a[0].tg_denRL;
      tg_tra_CPU = a[0].tg_hoantat;
      TongTG_cho += a[0].tg_cho;
      TongTG_hoantat += a[0].tg_hoantat;

      for (let i = 1; i < sotientrinh; i++) {
        let min = a[i].do_uu_tien;
        for (let j = i + 1; j < sotientrinh; j++) {
          if (min > a[j].do_uu_tien && a[j].tg_denRL <= tg_tra_CPU) {
            min = a[j].do_uu_tien;
            [a[i].ma_tt, a[j].ma_tt] = hoandoi(a[i].ma_tt, a[j].ma_tt);
            [a[i].tg_denRL, a[j].tg_denRL] = hoandoi(a[i].tg_denRL, a[j].tg_denRL);
            [a[i].tg_xuly, a[j].tg_xuly] = hoandoi(a[i].tg_xuly, a[j].tg_xuly);
            [a[i].do_uu_tien, a[j].do_uu_tien] = hoandoi(a[i].do_uu_tien, a[j].do_uu_tien);
          }
        }
        a[i].tg_cho = tg_tra_CPU - a[i].tg_denRL;
        TongTG_cho += a[i].tg_cho;
        tg_tra_CPU += a[i].tg_xuly;
        a[i].tg_hoantat = tg_tra_CPU - a[i].tg_denRL;
        TongTG_hoantat += a[i].tg_hoantat;
      }
    } else {
      for (let i = 0; i < sotientrinh; i++) {
        let min = a[i].do_uu_tien;
        for (let j = i + 1; j < sotientrinh; j++) {
          if (min > a[j].do_uu_tien && a[j].tg_denRL <= tg_tra_CPU) {
            min = a[j].do_uu_tien;
            [a[i].ma_tt, a[j].ma_tt] = hoandoi(a[i].ma_tt, a[j].ma_tt);
            [a[i].tg_denRL, a[j].tg_denRL] = hoandoi(a[i].tg_denRL, a[j].tg_denRL);
            [a[i].tg_xuly, a[j].tg_xuly] = hoandoi(a[i].tg_xuly, a[j].tg_xuly);
            [a[i].do_uu_tien, a[j].do_uu_tien] = hoandoi(a[i].do_uu_tien, a[j].do_uu_tien);
          }
        }
        a[i].tg_cho = tg_tra_CPU - a[i].tg_denRL;
        tg_tra_CPU += a[i].tg_xuly;
        a[i].tg_hoantat = tg_tra_CPU - a[i].tg_denRL;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        TongTG_cho += a[i].tg_cho;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        TongTG_hoantat += a[i].tg_hoantat;
      }
    }
  }

  const handleSubmit = () => {
    let output: JSX.Element | null = null;
    if (selectedAlgorithm === "") {
      output = (
        <div className="max-h-full p-5 block rounded-3xl bg-white max-w-full container">
          <h1 className="text-xl sm:text-xl text-black font-bold">OUTPUT</h1>
          <h2 className="text-black font-bold">Table will be shown here ...</h2>
        </div>
      );
    }
    if (selectedAlgorithm === "fcfs") {
      output = (
        <div>
          {/* Hiện table của bài toán */}
        </div>
      );
    }
    if (selectedAlgorithm === "sjf") {
      output = (
        <div>
          {/* Hiện table của bài toán */}
        </div>
      );
    }
    if (selectedAlgorithm === "srtf") {
      output = (
        <div>
          {/* Hiện table của bài toán */}
        </div>
      );
    }
    if (selectedAlgorithm === "rr") {
      output = (
        <div>
          {/* Hiện table của bài toán */}
        </div>
      );
    }
    if (selectedAlgorithm === "npp") {
      output = (
        <div>
          {/* Hiện table của bài toán */}
        </div>
      );
    }
    if (selectedAlgorithm === "pp") {
      pp()
      output = (
        <div>
          <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Job</TableColumn>
        <TableColumn>Arrival Time</TableColumn>
        <TableColumn>Burst Time</TableColumn>
        <TableColumn>Finish Time</TableColumn>
        <TableColumn>Turn Around Time</TableColumn>
        <TableColumn>Waiting Time</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>Tony Reichert</TableCell>
          <TableCell>CEO</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Zoey Lang</TableCell>
          <TableCell>Technical Lead</TableCell>
          <TableCell>Paused</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Jane Fisher</TableCell>
          <TableCell>Senior Developer</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell>William Howard</TableCell>
          <TableCell>Community Manager</TableCell>
          <TableCell>Vacation</TableCell>
        </TableRow>
      </TableBody>
    </Table>
        </div>
      );
    }
    setResult(output);
  };

  return (
    <main className="flex p-8 gap-8 row-start-1 max-h-32 sm:items-start">
      <div className="flex-auto flex flex-col p-4">
        <h1 className="text-xl text-white text-center pb-8 sm:text-4xl font-bold">
          CPU SCHEDULING VISUALIZER
        </h1>
        <div>
          {result}
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