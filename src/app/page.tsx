"use client";
import { useState } from "react";
import { Menu, notification, type MenuProps } from 'antd';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
import { ResponseData } from "@/types/api-response";

let responseData: ResponseData = {
  statusCode: undefined,
  message: undefined,
  data: undefined
};

export default function Home() {
  //khởi tạo các biến state để lưu giá trị của các input và kết quả
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [burstTime, setBurstTime] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [timeQuantum, setTimeQuantum] = useState<string>("");
  const [result, setResult] = useState<JSX.Element | null>(null);

  function getCharactersWithoutSpaces(input: string): string[] {
    return input.trim() === "" ? [] : input.trim().split(/\s+/);
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

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: errorData.statusCode,
        message: errorData.message,
        data: undefined,
      }
    }

    return response.json();
  }

  const rr = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime),
      quantum: timeQuantum
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'rr');

    if (responseData.data === undefined) {
      notification.error({
        message: 'Invalid input',
        description: responseData.message
      });
    } else {
      notification.success({
        message: 'Valid input',
        description: 'Processed successfully'
      });
    }
  }

  const fcfs = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'fcfs');

    if (responseData.data === undefined) {
      notification.error({
        message: 'Invalid input',
        description: responseData.message
      });
    } else {
      notification.success({
        message: 'Valid input',
        description: 'Processed successfully'
      });
    }
  }

  const pp = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime),
      arrPriority: getCharactersWithoutSpaces(priority)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'prio-p');

    if (responseData.data === undefined) {
      notification.error({
        message: 'Invalid input',
        description: responseData.message
      });
    } else {
      notification.success({
        message: 'Valid input',
        description: 'Processed successfully'
      });
    }
  }

  const npp = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime),
      arrPriority: getCharactersWithoutSpaces(priority)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'prio-nonp');

    if (responseData.data === undefined) {
      notification.error({
        message: 'Invalid input',
        description: responseData.message
      });
    } else {
      notification.success({
        message: 'Valid input',
        description: 'Processed successfully'
      });
    }
  }

  const sjf = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'sjf');

    if (responseData.data === undefined) {
      notification.error({
        message: 'Invalid input',
        description: responseData.message
      });
    } else {
      notification.success({
        message: 'Valid input',
        description: 'Processed successfully'
      });
    }
  }

  const sjf_nonp = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'sjf-nonp');

    if (responseData.data === undefined) {
      notification.error({
        message: 'Invalid input',
        description: responseData.message
      });
    } else {
      notification.success({
        message: 'Valid input',
        description: 'Processed successfully'
      });
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
  }//hàm reset bảng

  const handleSubmit = async () => {
    resetTable();
    let output: JSX.Element | null = null;
    if (selectedKey === "fcfs") {
      await fcfs();
      output = (
        <div>
          {typeof responseData.data !== 'undefined' &&
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className="px-3 text-center">Process</TableColumn>
                  <TableColumn className="px-3 text-center">Arrival Time</TableColumn>
                  <TableColumn className="px-3 text-center">Burst Time</TableColumn>
                  <TableColumn className="px-3 text-center">Finish Time</TableColumn>
                  <TableColumn className="px-3 text-center">Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="px-3 text-center">P{process.id}</TableCell>
                      <TableCell className="px-3 text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.burstTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.finishTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.waitingTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <p>Average Waiting Time: {responseData?.data?.averageWaitingTime}</p>
                <p>Average Finished Time: {responseData?.data?.averageFinishTime}</p>
              </div>
            </div>}
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán FCFS

    if (selectedKey === "sjf") {
      await sjf();
      output = (
        <div>
          {typeof responseData.data !== 'undefined' &&
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className="px-3 text-center">Process</TableColumn>
                  <TableColumn className="px-3 text-center">Arrival Time</TableColumn>
                  <TableColumn className="px-3 text-center">Burst Time</TableColumn>
                  <TableColumn className="px-3 text-center">Finish Time</TableColumn>
                  <TableColumn className="px-3 text-center">Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="px-3 text-center">P{process.id}</TableCell>
                      <TableCell className="px-3 text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.burstTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.finishTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.waitingTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <p>Average Waiting Time: {responseData?.data?.averageWaitingTime}</p>
                <p>Average Finished Time: {responseData?.data?.averageFinishTime}</p>
              </div>
            </div>}
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán SJF

    if (selectedKey === "srtf") {
      await sjf_nonp();
      output = (
        <div>
          {typeof responseData.data !== 'undefined' &&
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className="px-3 text-center">Process</TableColumn>
                  <TableColumn className="px-3 text-center">Arrival Time</TableColumn>
                  <TableColumn className="px-3 text-center">Burst Time</TableColumn>
                  <TableColumn className="px-3 text-center">Finish Time</TableColumn>
                  <TableColumn className="px-3 text-center">Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="px-3 text-center">P{process.id}</TableCell>
                      <TableCell className="px-3 text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.burstTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.finishTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.waitingTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <p>Average Waiting Time: {responseData?.data?.averageWaitingTime}</p>
                <p>Average Finished Time: {responseData?.data?.averageFinishTime}</p>
              </div>
            </div>}
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bfi toán SRTF

    if (selectedKey === "rr") {
      await rr();
      output = (
        <div>
          {typeof responseData.data !== 'undefined' &&
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className="px-3 text-center">Process</TableColumn>
                  <TableColumn className="px-3 text-center">Arrival Time</TableColumn>
                  <TableColumn className="px-3 text-center">Burst Time</TableColumn>
                  <TableColumn className="px-3 text-center">Finish Time</TableColumn>
                  <TableColumn className="px-3 text-center">Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="px-3 text-center">P{process.id}</TableCell>
                      <TableCell className="px-3 text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.burstTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.finishTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.waitingTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <p>Average Waiting Time: {responseData?.data?.averageWaitingTime}</p>
                <p>Average Finished Time: {responseData?.data?.averageFinishTime}</p>
              </div>
            </div>}
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán RR

    if (selectedKey === "npp") {
      await npp();
      output = (
        <div>
          {typeof responseData.data !== 'undefined' &&
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className="px-3 text-center">Process</TableColumn>
                  <TableColumn className="px-3 text-center">Arrival Time</TableColumn>
                  <TableColumn className="px-3 text-center">Burst Time</TableColumn>
                  <TableColumn className="px-3 text-center">Finish Time</TableColumn>
                  <TableColumn className="px-3 text-center">Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="px-3 text-center">P{process.id}</TableCell>
                      <TableCell className="px-3 text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.burstTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.finishTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.waitingTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <p>Average Waiting Time: {responseData?.data?.averageWaitingTime}</p>
                <p>Average Finished Time: {responseData?.data?.averageFinishTime}</p>
              </div>
            </div>}
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán Priority Non Preemptive

    if (selectedKey === "pp") {
      await pp();
      output = (
        <div>
          {typeof responseData.data !== 'undefined' &&
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className="px-3 text-center">Process</TableColumn>
                  <TableColumn className="px-3 text-center">Arrival Time</TableColumn>
                  <TableColumn className="px-3 text-center">Burst Time</TableColumn>
                  <TableColumn className="px-3 text-center">Finish Time</TableColumn>
                  <TableColumn className="px-3 text-center">Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="px-3 text-center">P{process.id}</TableCell>
                      <TableCell className="px-3 text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.burstTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.finishTime}</TableCell>
                      <TableCell className="px-3 text-center">{process.waitingTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <p>Average Waiting Time: {responseData?.data?.averageWaitingTime}</p>
                <p>Average Finished Time: {responseData?.data?.averageFinishTime}</p>
              </div>
            </div>}
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán Priority Preemptive
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
          label: 'Shortest Job First Pre',
        },
        {
          key: 'pp',
          label: 'Priority Pre',
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
          label: 'Priority NonPre',
        },
        {
          key: 'rr',
          label: 'Round Robin',
        },
        {
          key: 'srtf',
          label: 'Shortest Job First NonPre',
        },
      ],
    },
  ];//layout cac loai thuat toan

  const onClick: MenuProps['onClick'] = (e: any) => {
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
