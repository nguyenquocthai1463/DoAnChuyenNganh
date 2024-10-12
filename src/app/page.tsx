"use client";
import { useState } from "react";
import { Menu, type MenuProps } from 'antd';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
import { ResponseData } from "@/types/api-response";

class TienTrinhNPP {
  tg_cho: number;
  tg_denRL: number;
  tg_xuly: number;
  tg_hoantat: number;
  do_uu_tien: number;
  constructor(tg_denRL: number, tg_xuly: number, do_uu_tien: number) {
    this.tg_cho = 0;
    this.tg_denRL = tg_denRL;
    this.tg_xuly = tg_xuly;
    this.tg_hoantat = 0;
    this.do_uu_tien = do_uu_tien;
  }
}//Khởi tạo class cho tiến trình Priority Non Preemptive

interface TienTrinhFCFS {
  tg_cho: number;
  tg_denRL: number;
  tg_xuly: number;
  tg_hoantat: number;
  tg_cho_tb: number;
  tg_hoantat_tb: number;
}//khởi tạo interface cho tiến trình FCFS
interface TienTrinhSRTF {
  tg_cho: number;
  tg_denRL: number;
  tg_xuly: number;
  tg_hoantat: number;
  tg_cho_tb: number;
  tg_hoantat_tb: number;
}//khởi tạo interface cho tiến trình SRTF

const aNPP: TienTrinhNPP[] = []; //khai báo mảng a chứa các tiến trình
const aFCFS: TienTrinhFCFS[] = []; //khai báo mảng a chứa các tiến trình
const aSRTF: TienTrinhSRTF[] = []; //khai báo mảng a chứa các tiến trình
let responseData: ResponseData;

export default function Home() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [burstTime, setBurstTime] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [timeQuantum, setTimeQuantum] = useState<string>("");
  const [result, setResult] = useState<JSX.Element | null>(null);

  //khởi tạo các biến state để lưu giá trị của các input và kết quả
  let count = 0;
  //khởi tạo biến count để lưu số lượng tiến trình
  function demthoigianden(input: string): number {
    const stringWithoutSpaces = input.replace(/\s+/g, '');
    return stringWithoutSpaces.length;
  }//hàm đếm số lượng tiến trình

  function getCharactersWithoutSpaces(input: string): number[] {
    const numbers = input.match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
  }//hàm lấy các số từ input

  // Hàm call API cho các thuật toán CPU
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callingAPIWithCPUSchedulingAlgo = async (req: any, algo: string): Promise<ResponseData> => {
    const response = await fetch(`/api/cpu-scheduling/${algo}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    return response.json();
  }

  function npp() {
    const tam: number[] = []; //khai báo mảng tạm chứa các tiến trình
    let sotientrinh: number;
    count = demthoigianden(arrivalTime);
    let dem = 0;
    let t = 0;
    let TongTG_cho = 0;
    let TongTG_hoantat = 0;
    let uu_tien_nho = 0;
    // eslint-disable-next-line prefer-const
    sotientrinh = count;
    const tg_denRL = getCharactersWithoutSpaces(arrivalTime)
    const tg_xuly = getCharactersWithoutSpaces(burstTime)
    const do_uu_tien = getCharactersWithoutSpaces(priority)
    for (let i = 0; i < sotientrinh; i++) {
      aNPP.push({
        tg_cho: 0,
        tg_denRL: tg_denRL[i],
        tg_xuly: tg_xuly[i],
        tg_hoantat: 0,
        do_uu_tien: do_uu_tien[i],
      });
      tam.push(tg_xuly[i]);
    }

    aNPP[9] = new TienTrinhNPP(0, 5000, 5000);

    for (t = 0; dem !== sotientrinh; t++) {
      uu_tien_nho = 9;
      for (let i = 0; i < sotientrinh; i++) {
        if (aNPP[uu_tien_nho].do_uu_tien > aNPP[i].do_uu_tien && aNPP[i].tg_denRL <= t && aNPP[i].tg_xuly > 0) {
          uu_tien_nho = i;
        }
      }

      aNPP[uu_tien_nho].tg_xuly = aNPP[uu_tien_nho].tg_xuly - 1;

      if (aNPP[uu_tien_nho].tg_xuly === 0) {
        dem++;
        aNPP[uu_tien_nho].tg_cho = t + 1 - aNPP[uu_tien_nho].tg_denRL - tam[uu_tien_nho];
        aNPP[uu_tien_nho].tg_hoantat = t + 1 - aNPP[uu_tien_nho].tg_denRL;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        TongTG_cho += aNPP[uu_tien_nho].tg_cho;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        TongTG_hoantat += aNPP[uu_tien_nho].tg_hoantat;
      }
      t++;
    }
  }//Hàm xử lý bài toán Priority Non Preemptive

  function srtf() {
    const tam: number[] = [];
    let nhonhat: number;
    let dem = 0;
    let thoigian: number;
    let soTT: number;
    let tgcho = 0;
    let tght = 0;
    let ketthuc: number;
    count = demthoigianden(arrivalTime);
    // eslint-disable-next-line prefer-const
    soTT = count;
    for (let i = 0; i < soTT; i++) {
      aSRTF.push({
        tg_cho: 0,
        tg_denRL: getCharactersWithoutSpaces(arrivalTime)[i],
        tg_hoantat: 0,
        tg_xuly: getCharactersWithoutSpaces(burstTime)[i],
        tg_cho_tb: 0,
        tg_hoantat_tb: 0,
      });
      tam[i] = aSRTF[i].tg_xuly;
    }
    aSRTF[9].tg_xuly = 60;  // Giả sử thời gian xử lý của tiến trình cuối cùng là 60 giây

    for (thoigian = 0; dem !== soTT; thoigian++) {
      nhonhat = 9; // Xét tiến trình có thời gian nhỏ nhất (tiến trình sau cùng)
      for (let i = 0; i < soTT; i++) {
        if (aSRTF[i].tg_denRL <= thoigian && aSRTF[i].tg_xuly < aSRTF[nhonhat].tg_xuly && aSRTF[i].tg_xuly > 0) {
          nhonhat = i;
        }
      }
      aSRTF[nhonhat].tg_xuly--;
      if (aSRTF[nhonhat].tg_xuly === 0) {
        dem++;
        ketthuc = thoigian + 1;
        tgcho += ketthuc - aSRTF[nhonhat].tg_denRL - tam[nhonhat];
        tght += ketthuc - aSRTF[nhonhat].tg_denRL;
      }
    }

    aSRTF[0].tg_cho_tb = tgcho / soTT;
    aSRTF[0].tg_hoantat_tb = tght / soTT;
  }//Hàm xử lý bài toán SRTF

  const rr = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime),
      quantum: Number(timeQuantum)
    };

    try {
      const data = await callingAPIWithCPUSchedulingAlgo(request, 'rr');
      responseData = data;
      // console.log(data);
      // console.log('response data', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const fcfs = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime)
    };

    try {
      const data = await callingAPIWithCPUSchedulingAlgo(request, 'fcfs');
      responseData = data;
      // console.log(data);
      // console.log('response data', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const pp = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime),
      arrPriority: getCharactersWithoutSpaces(priority)
    };

    try {
      const data = await callingAPIWithCPUSchedulingAlgo(request, 'prio-p');
      responseData = data;
      // console.log(data);
      // console.log('response data', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const sjf = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime)
    };

    try {
      const data = await callingAPIWithCPUSchedulingAlgo(request, 'sjf');
      responseData = data;
      // console.log(data);
      // console.log('response data', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const resetForm = () => {
    setArrivalTime("");
    setBurstTime("");
    setPriority("");
    setTimeQuantum("");
  };//hàm reset form

  const resetTable = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    aNPP.splice(0, aNPP.length);
    aNPP.splice(0, aNPP.length);
    aFCFS.splice(0, aFCFS.length);
  }//hàm reset bảng

  const handleSubmit = async () => {
    resetTable();
    let output: JSX.Element | null = null;
    if (selectedKey === "fcfs") {
      await fcfs()
      output = (
        <div>
          {
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className="px-3 text-center">Job</TableColumn>
                  <TableColumn className="px-3 text-center">Burst Time</TableColumn>
                  <TableColumn className="px-3 text-center">Finish Time</TableColumn>
                  <TableColumn className="px-3 text-center">Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="px-3 text-center">{process.id}</TableCell>
                      <TableCell className="px-3 text-center">{process.burstTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.finishTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.waitingTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
                <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
              </div>
            </div>}
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán FCFS
    if (selectedKey === "sjf") {
      await sjf()
      output = (
        <div>
          {<div>
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>Job</TableColumn>
                <TableColumn>Burst Time</TableColumn>
                <TableColumn>Finish Time</TableColumn>
                <TableColumn>Waiting Time</TableColumn>
              </TableHeader>
              <TableBody>
                {(responseData?.data?.processes || []).map(process => (
                  <TableRow key={process.id}>
                    <TableCell className="text-center">{process.id}</TableCell>
                    <TableCell className="text-center">{process.burstTime}</TableCell>
                    <TableCell className="text-center">{process.finishTime}</TableCell>
                    <TableCell className="text-center">{process.waitingTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>}
          <div className="mt-4">
            <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
            <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
          </div>

        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán SJF
    if (selectedKey === "srtf") {
      srtf()
      output = (
        <div>
          {
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
                  {aSRTF.map((process, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">{process.tg_denRL}</TableCell>
                      <TableCell className="text-center">{process.tg_xuly}</TableCell>
                      <TableCell className="text-center">{process.tg_hoantat}</TableCell>
                      <TableCell className="text-center">{process.tg_hoantat - process.tg_denRL}</TableCell>
                      <TableCell className="text-center">{process.tg_cho}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>}
          <p>Thời gian chờ trung bình: {aSRTF[0].tg_cho_tb}</p>
          <p>Thời gian hoàn tất trung bình: {aSRTF[0].tg_hoantat_tb}</p>
        </div>
      );
      setResult(output);
      resetForm();
    }
    if (selectedKey === "rr") {
      await rr();
      output = (
        <div>
          {
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className="px-2 text-center">Job</TableColumn>
                  <TableColumn className="px-2 text-center">Arrival Time</TableColumn>
                  <TableColumn className="px-2 text-center">Burst Time</TableColumn>
                  <TableColumn className="px-2 text-center">Finish Time</TableColumn>
                  <TableColumn className="px-2 text-center">Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="px-2 text-center">{process.id}</TableCell>
                      <TableCell className="px-2 text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="px-2 text-center">{process.burstTime}</TableCell>
                      <TableCell className="px-2 text-center">{process.finishTime}</TableCell>
                      <TableCell className="px-2 text-center">{process.waitingTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
              <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
            </div>
          }
        </div>
      );
    }//Xử lý bài toán RR
    if (selectedKey === "npp") {
      npp()
      output = (
        <div>
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>Job</TableColumn>
              <TableColumn>Arrival Time</TableColumn>
              <TableColumn>Burst Time</TableColumn>
              <TableColumn>Turn Around Time</TableColumn>
              <TableColumn>Waiting Time</TableColumn>
            </TableHeader>
            <TableBody>
              {aNPP.map((process, index) => (
                // eslint-disable-next-line react/jsx-key
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{process.tg_denRL}</TableCell>
                  <TableCell className="text-center">{process.tg_xuly}</TableCell>
                  <TableCell className="text-center">{process.tg_hoantat}</TableCell>
                  <TableCell className="text-center">{process.tg_cho}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán Priority Non Preemptive
    if (selectedKey === "pp") {
      await pp()
      output = (
        <div>
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>Job</TableColumn>
              <TableColumn>Finish Time</TableColumn>
              <TableColumn>Waiting Time</TableColumn>
            </TableHeader>
            <TableBody>
              {(responseData?.data?.processes || []).map(process => (
                <TableRow key={process.id}>
                  <TableCell className="text-center">{process.id}</TableCell>
                  <TableCell className="text-center">{process.finishTime}</TableCell>
                  <TableCell className="text-center">{process.waitingTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }//Xử lý bài toán Priority Preemptive
    setResult(output);
    resetForm();
  };//hàm xử lý form

  type MenuItem = Required<MenuProps>['items'][number];

  const items: MenuItem[] = [
    {
      key: 'preemptive',
      label: 'Preemptive',
      type: 'group',
      style: { fontSize: '1rem' },
      children: [
        {
          key: 'fcfs',
          label: 'First Come First Serve',
        },
        {
          key: 'sjf',
          label: 'Shortest Job First',
        },
        {
          key: 'pp',
          label: 'Priority',
        },
      ],
    },
    {
      key: 'non-preemptive',
      label: 'Non Preemptive',
      type: 'group',
      style: { fontSize: '1rem' },
      children: [
        {
          key: 'npp',
          label: 'Priority Non Preemptive',
        },
        {
          key: 'rr',
          label: 'Round Robin',
        },
        {
          key: 'srtf',
          label: 'Shortest Remaining Time First',
        },
      ],
    },
  ];//layout cac loai thuat toan

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  };//hàm xử lý click

  const renderForm = () => {
    switch (selectedKey) {
      //fcfs
      case 'fcfs':
        return <div className="bg-02 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Arrival Time</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="md:w-full"></div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-red-800 text-white rounded-xl h-12 px-2">
              Submit
            </button></div>
        </div>;
      //sjf
      case 'sjf':
        return <div className="bg-02 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Arrival Time</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className=" md:w-full"></div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-red-800 text-white rounded-xl h-12 px-2">
              Submit
            </button></div>
        </div>;
      //priority
      case 'pp':
        return <div className="bg-02 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Arrival Time</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Priorities</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="Lower #= Higher"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-red-800 text-white rounded-xl h-12 px-2">
              Submit
            </button>
          </div>
        </div>;
      //non-preemptive-priority
      case 'npp':
        return <div className="bg-02 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Arrival Time</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Priorities</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="Lower #= Higher"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-red-800 text-white rounded-xl h-12 px-2">
              Submit
            </button></div>
        </div>;
      //round-robin
      case 'rr':
        return <div className="bg-02 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Arrival Time</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Time Quantum</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 3"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-red-800 text-white rounded-xl h-12 px-2">
              Submit
            </button></div>
        </div>;
      //srtf
      case 'srtf':
        return <div className="bg-02 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Arrival Time</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className=" md:w-full"></div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-red-800 text-white rounded-xl h-12 px-2">
              Submit
            </button></div>
        </div>;
      default:
        return null;
    }
  };

  return (
    <><button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
      <span className="sr-only">Open sidebar</span>
      <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
      </svg>
    </button>
      <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-2 dark:bg-02">
          <div className=" text-while">
            <Menu
              onClick={onClick}
              className="bg-02"
              mode="inline"
              items={items} />
          </div>
        </div>
      </aside>
      <div className="h-screen sm:ml-64">
        <div className="h-4/6 md:flex-col">
          <div className="p-4 flex-none max-w-md mx-auto text-center md:max-w-2xl">
            <p className="text-xl font-bold">Tìm hiểu công nghệ Jamstack và xây dựng ứng dụng Web minh họa các giải thuật định thời CPU</p>
          </div>
          <div className="p-4 md:min-h-full">
            {result}
          </div>
          <div className="h-1/6">
            {renderForm()}
          </div>
        </div>

      </div>

    </>
  );
}
