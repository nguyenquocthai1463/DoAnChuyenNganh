"use client";
import { useEffect, useRef, useState } from "react";
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
import Swal from 'sweetalert2';
import FCFSGanttChart from "@/components/FCFSGanttChart";
import SJFPGanttChart from "@/components/SJFPGanttChart";
import SJFNPGanttChart from "@/components/SJFNPGanttChart";
import handleSJFNPGanttChart from "@/types/handle-sjfnp-gantt-chart";
import handleRRGanttChart from "@/types/handle-rr-gantt-chart";
import RRGanttChart from "@/components/RRGanttChart";
import PPGanttChart from "@/components/PPGanttChart";
import handlePPGanttChart from "@/types/handle-pp-gantt-chart";
import handleNPPGanttChart from "@/types/handle-npp-gantt-chart";
import NPPGanttChart from "@/components/NPPGanttChart";

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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = (event: { target: any; }) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false); // Đóng sidebar nếu click ngoài sidebar
    }
  };

  const handleMenuItemClick = () => {
    setSidebarOpen(false); // Đóng sidebar khi nhấn vào item
  };

  useEffect(() => {
    // Thêm sự kiện lắng nghe khi component được render
    document.addEventListener('mousedown', handleClickOutside);

    // Dọn dẹp sự kiện khi component bị hủy
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

    if (!response.ok) {
      const warningData = await response.json();
      return {
        statusCode: warningData.statusCode,
        message: warningData.message,
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
  }

  const fcfs = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'fcfs');

  }

  const pp = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime),
      arrPriority: getCharactersWithoutSpaces(priority)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'prio-p');

  }

  const npp = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime),
      arrPriority: getCharactersWithoutSpaces(priority)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'prio-nonp');

  }

  const sjf = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime)
    };

    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'sjf');

  }

  const srtf = async () => {
    const request = {
      arrPro: getCharactersWithoutSpaces(arrivalTime).map((_item, index) => index + 1),
      arrArrivalTime: getCharactersWithoutSpaces(arrivalTime),
      arrBurstTime: getCharactersWithoutSpaces(burstTime)
    };
    responseData = await callingAPIWithCPUSchedulingAlgo(request, 'sjf-nonp');

  }

  const resetForm = () => {
    setArrivalTime("");
    setBurstTime("");
    setPriority("");
    setTimeQuantum("");
  };//hàm reset form

  const resetTable = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setResult(null);
  }//hàm reset bảng

  function kiemTraChuoiToanSoHayKhong(value: string) {
    return /^\d+$/.test(value.replace(/\s+/g, ''));
  }

  function kiemTraHopLeCuaThoiGianXuLy(value: string) {
    return /\b0\b|-\d+/.test(value.replace(/\s+/g, ''));
  }


  const handleSubmit = async () => {
    resetTable();
    let output: JSX.Element | null = null;
    if (selectedKey === "fcfs") {
      if (arrivalTime !== "" && burstTime !== "") {
        if (kiemTraChuoiToanSoHayKhong(arrivalTime) && kiemTraChuoiToanSoHayKhong(burstTime)) {
          if (kiemTraHopLeCuaThoiGianXuLy(burstTime) === false) {
            if (getCharactersWithoutSpaces(arrivalTime).length === getCharactersWithoutSpaces(burstTime).length) {
              await fcfs();
              output = (
                <div>
                  {
                    <div className="justify-center">
                      <Table aria-label="Example static collection table">
                        <TableHeader>
                          <TableColumn className="px-3 text-center">Tiến trình</TableColumn>
                          <TableColumn className="px-3 text-center">Thời gian đến</TableColumn>
                          <TableColumn className="px-3 text-center">Thời gian xử lý</TableColumn>
                          <TableColumn className="px-3 text-center">Thời gian hoàn thành</TableColumn>
                          <TableColumn className="px-3 text-center">Thời gian chờ</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {(responseData?.data?.processes || []).map(process => (
                            <TableRow key={process.id}>
                              <TableCell className="px-3 text-center border">{process.id}</TableCell>
                              <TableCell className="px-3 text-center border">{process.arrivalTime}</TableCell>
                              <TableCell className="px-3 text-center border">{process.burstTime}</TableCell>
                              <TableCell className="px-3 text-center border">{process.finishTime}</TableCell>
                              <TableCell className="px-3 text-center border">{process.waitingTime}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4">
                        <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
                        <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
                      </div>
                      <div className="mt-4">
                        <p className="mb-2">Biểu đồ Gain:</p>
                        <FCFSGanttChart processes={responseData.data?.processes} />
                      </div>
                    </div>}
                </div>
              );
              setResult(output);
              resetForm();
            }
            else {
              Swal.fire({
                icon: 'warning',
                text: 'Số lượng tiến trình không khớp nhau!',
                confirmButtonColor: '#000',
              })
            }
          }
          else {
            Swal.fire({
              icon: 'warning',
              text: 'Số 0 và số âm không hợp lệ!',
              confirmButtonColor: '#000',
            })
          }
        }
        else {
          Swal.fire({
            icon: 'warning',
            text: 'Vui lòng nhập đúng định dạng!',
            confirmButtonColor: '#000',
          })
        }

      } else {
        Swal.fire({
          icon: 'warning',
          confirmButtonColor: '#000',
          text: 'Vui lòng nhập đủ thông tin!',
        })
      }
    }

    if (selectedKey === "sjf") {
      if (arrivalTime !== "" && burstTime !== "") {
        if (kiemTraChuoiToanSoHayKhong(arrivalTime) && kiemTraChuoiToanSoHayKhong(burstTime)) {
          if (kiemTraHopLeCuaThoiGianXuLy(burstTime) === false) {
            if (getCharactersWithoutSpaces(arrivalTime).length === getCharactersWithoutSpaces(burstTime).length) {
              await sjf();
              output = (
                <div>
                  {
                    <div>
                      <Table aria-label="Example static collection table">
                        <TableHeader>
                          <TableColumn className="px-3 text-center">Tiến trình</TableColumn>
                          <TableColumn className="px-3 text-center">Thời gian đến</TableColumn>
                          <TableColumn className="px-3 text-center">Thời gian xử lý</TableColumn>
                          <TableColumn className="px-3 text-center">Thời gian hoàn thành</TableColumn>
                          <TableColumn className="px-3 text-center">Thời gian chờ</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {(responseData?.data?.processes || []).map(process => (
                            <TableRow key={process.id}>
                              <TableCell className="px-3 text-center border">{process.id}</TableCell>
                              <TableCell className="px-3 text-center border">{process.arrivalTime}</TableCell>
                              <TableCell className="px-3 text-center border">{process.burstTime}</TableCell>
                              <TableCell className="px-3 text-center border">{process.finishTime}</TableCell>
                              <TableCell className="px-3 text-center border">{process.waitingTime}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4">
                        <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
                        <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
                      </div>
                      <div className="mt-4">
                        <p className="mb-2">Biểu đồ Gain:</p>
                        <SJFPGanttChart processes={responseData.data?.processes} />
                      </div>
                    </div>}
                </div>
              );
              setResult(output);
              resetForm();
            }
            else {
              Swal.fire({
                icon: 'warning',
                text: 'Số lượng tiến trình không khớp nhau!',
                confirmButtonColor: '#000',
              })
            }
          }
          else {
            Swal.fire({
              icon: 'warning',
              text: 'Số 0 và số âm không hợp lệ!',
              confirmButtonColor: '#000',
            })
          }
        }
        else {
          Swal.fire({
            icon: 'warning',
            text: 'Vui lòng nhập đúng định dạng!',
            confirmButtonColor: '#000',
          })
        }
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'Vui lòng nhập đủ thông tin!',
          confirmButtonColor: '#000',
        })
      }
    }

    if (selectedKey === "srtf") {
      if (arrivalTime !== "" && burstTime !== "") {
        if (kiemTraChuoiToanSoHayKhong(arrivalTime) && kiemTraChuoiToanSoHayKhong(burstTime)) {
          if (kiemTraHopLeCuaThoiGianXuLy(burstTime) === false) {
            if (getCharactersWithoutSpaces(arrivalTime).length === getCharactersWithoutSpaces(burstTime).length) {
              await srtf();
              output = (
                <div>
                  {<div>
                    <Table aria-label="Example static collection table">
                      <TableHeader>
                        <TableColumn className="px-3 text-center">Tiến trình</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian đến</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian xử lý</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian hoàn thành</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian chờ</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {(responseData?.data?.processes || []).map(process => (
                          <TableRow key={process.id}>
                            <TableCell className="px-3 text-center border">{process.id}</TableCell>
                            <TableCell className="px-3 text-center border">{process.arrivalTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.burstTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.finishTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.waitingTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>}
                  <div className="mt-4">
                    <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
                    <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
                  </div>
                  <div className="mt-4">
                  <p className="mb-2">Biểu đồ Gain:</p>
                    <SJFNPGanttChart processes={handleSJFNPGanttChart(responseData?.data?.processes)} />
                  </div>
                </div>
              );
              setResult(output);
              resetForm();
            }
            else {
              Swal.fire({
                icon: 'warning',
                text: 'Số lượng tiến trình không khớp nhau!',
                confirmButtonColor: '#000',
              })
            }
          }
          else {
            Swal.fire({
              icon: 'warning',

              text: 'Số 0 và số âm không hợp lệ!',
              confirmButtonColor: '#000',
            })
          }
        }
        else {
          Swal.fire({
            icon: 'warning',
            text: 'Vui lòng nhập đúng định dạng!',
            confirmButtonColor: '#000',
          })
        }
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'Vui lòng nhập đủ thông tin!',
          confirmButtonColor: '#000',
        })
      }
    }

    if (selectedKey === "rr") {
      if (arrivalTime !== "" && burstTime !== "" && timeQuantum !== "") {
        if (kiemTraChuoiToanSoHayKhong(arrivalTime) && kiemTraChuoiToanSoHayKhong(burstTime) && kiemTraChuoiToanSoHayKhong(timeQuantum)) {
          if (kiemTraHopLeCuaThoiGianXuLy(burstTime) === false && kiemTraHopLeCuaThoiGianXuLy(timeQuantum) === false) {
            if (getCharactersWithoutSpaces(arrivalTime).length === getCharactersWithoutSpaces(burstTime).length) {
              await rr();
              output = (
                <div>
                  {<div>
                    <Table aria-label="Example static collection table" className="custom-table">
                      <TableHeader>
                        <TableColumn className="px-3 text-center ">Tiến trình</TableColumn>
                        <TableColumn className="px-3 text-center ">Thời gian đến</TableColumn>
                        <TableColumn className="px-3 text-center ">Thời gian xử lý</TableColumn>
                        <TableColumn className="px-3 text-center ">Thời gian hoàn thành</TableColumn>
                        <TableColumn className="px-3 text-center ">Thời gian chờ</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {(responseData?.data?.processes || []).map(process => (
                          <TableRow key={process.id} className="border">
                            <TableCell className="px-3 text-center border">{process.id}</TableCell>
                            <TableCell className="px-3 text-center border">{process.arrivalTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.burstTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.finishTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.waitingTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  </div>}
                  <div className="mt-4">
                    <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
                    <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
                  </div>
                  <div className="mt-4">
                  <p className="mb-2">Biểu đồ Gain:</p>
                    <RRGanttChart processes={handleRRGanttChart(responseData?.data?.processes, Number(timeQuantum))} />
                  </div>
                </div>
              );
              setResult(output);
              resetForm();
            }
            else {
              Swal.fire({
                icon: 'warning',
                text: 'Số lượng tiến trình không khớp nhau!',
                confirmButtonColor: '#000',
              })
            }
          }
          else {
            Swal.fire({
              icon: 'warning',
              text: 'Số 0 và số âm không hợp lệ!',
              confirmButtonColor: '#000',
            })
          }
        }
        else {
          Swal.fire({
            icon: 'warning',
            background: '#000',
            text: 'Vui lòng nhập đúng định dạng!',
            confirmButtonColor: '#000',
          })
        }
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'Vui lòng nhập đủ thông tin!',
          confirmButtonColor: '#000',
        })
      }
    }

    if (selectedKey === "npp") {
      if (arrivalTime !== "" && burstTime !== "" && priority !== "") {
        if (kiemTraChuoiToanSoHayKhong(arrivalTime) && kiemTraChuoiToanSoHayKhong(burstTime) && kiemTraChuoiToanSoHayKhong(priority)) {
          if (kiemTraHopLeCuaThoiGianXuLy(burstTime) === false) {
            if (getCharactersWithoutSpaces(arrivalTime).length === getCharactersWithoutSpaces(burstTime).length && getCharactersWithoutSpaces(arrivalTime).length === getCharactersWithoutSpaces(priority).length) {
              await npp();
              output = (
                <div>
                  {<div>
                    <Table aria-label="Example static collection table">
                      <TableHeader>
                        <TableColumn className="px-3 text-center">Tiến trình</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian đến</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian xử lý</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian hoàn thành</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian chờ</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {(responseData?.data?.processes || []).map(process => (
                          <TableRow key={process.id}>
                            <TableCell className="px-3 text-center border">{process.id}</TableCell>
                            <TableCell className="px-3 text-center border">{process.arrivalTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.burstTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.finishTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.waitingTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>}
                  <div className="mt-4">
                    <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
                    <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
                  </div>
                  <div className="mt-4">
                  <p className="mb-2">Biểu đồ Gain:</p>
                    <NPPGanttChart processes={
                      handleNPPGanttChart(responseData?.data?.processes, getCharactersWithoutSpaces(priority))
                    } />
                  </div>
                </div>
              );
              setResult(output);
              resetForm();
            }
            else {
              Swal.fire({
                icon: 'warning',
                text: 'Số lượng tiến trình không khớp nhau!',
                confirmButtonColor: '#000',
              })
            }
          }
          else {
            Swal.fire({
              icon: 'warning',

              text: 'Số 0 và số âm không hợp lệ!',
              confirmButtonColor: '#000',
            })
          }
        }
        else {
          Swal.fire({
            icon: 'warning',
            text: 'Vui lòng nhập đúng định dạng!',
            confirmButtonColor: '#000',
          })
        }
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'Vui lòng nhập đủ thông tin!',
          confirmButtonColor: '#000',
        })
      }
    }

    if (selectedKey === "pp") {
      if (arrivalTime !== "" && burstTime !== "" && priority !== "") {
        if (kiemTraChuoiToanSoHayKhong(arrivalTime) && kiemTraChuoiToanSoHayKhong(burstTime) && kiemTraChuoiToanSoHayKhong(priority)) {
          if (kiemTraHopLeCuaThoiGianXuLy(burstTime) === false) {
            if (getCharactersWithoutSpaces(arrivalTime).length === getCharactersWithoutSpaces(burstTime).length && getCharactersWithoutSpaces(arrivalTime).length === getCharactersWithoutSpaces(priority).length) {
              await pp();
              output = (
                <div className="justify-center">
                  {<div>
                    <Table aria-label="Example static collection table">
                      <TableHeader>
                        <TableColumn className="px-3 text-center">Tiến trình</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian đến</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian xử lý</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian hoàn thành</TableColumn>
                        <TableColumn className="px-3 text-center">Thời gian chờ</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {(responseData?.data?.processes || []).map(process => (
                          <TableRow key={process.id}>
                            <TableCell className="px-3 text-center border">{process.id}</TableCell>
                            <TableCell className="px-3 text-center border">{process.arrivalTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.burstTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.finishTime}</TableCell>
                            <TableCell className="px-3 text-center border">{process.waitingTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>}
                  <div className="mt-4">
                    <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
                    <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
                  </div>
                  <div className="mt-4">
                  <p className="mb-2">Biểu đồ Gain:</p>
                    <PPGanttChart processes={
                      handlePPGanttChart(responseData?.data?.processes, getCharactersWithoutSpaces(priority))
                    } />
                  </div>
                </div>
              );
              setResult(output);
              resetForm();
            }
            else {
              Swal.fire({
                icon: 'warning',
                text: 'Số lượng tiến trình không khớp nhau!',
                confirmButtonColor: '#000',
              })
            }
          }
          else {
            Swal.fire({
              icon: 'warning',

              text: 'Số 0 và số âm không hợp lệ!',
              confirmButtonColor: '#000',
            })
          }
        }
        else {
          Swal.fire({
            icon: 'warning',
            text: 'Vui lòng nhập đúng định dạng!',
            confirmButtonColor: '#000',
          })
        }
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'Vui lòng nhập đủ thông tin!',
          confirmButtonColor: '#000',
        })
      }
    }
  };//hàm xử lý form

  type MenuItem = Required<MenuProps>['items'][number];

  const items: MenuItem[] = [
    {
      key: 'preemptive',
      label: 'Độc quyền',
      type: 'group',
      style: { fontSize: '1rem', color: 'white' },
      children: [
        {
          key: 'fcfs',
          label: 'First Come First Serve',
          style: { color: 'black',  },
        },
        {
          key: 'sjf',
          label: 'Shortest Job First Pre',
          style: { color: 'black' },
          className: 'on-forcus-items',
        },
        {
          key: 'pp',
          label: 'Priority Pre',
          style: { color: 'black' },
          className: 'on-forcus-items',
        },
      ],
    },
    {
      key: 'non-preemptive',
      label: 'Không độc quyền',
      type: 'group',
      style: { fontSize: '1rem', color: 'white' },
      children: [
        {
          key: 'npp',
          label: 'Priority NonPre',
          style: { color: 'black' },
          className: 'on-forcus-items',
        },
        {
          key: 'rr',
          label: 'Round Robin',
          style: { color: 'black' },
          className: 'on-forcus-items',
        },
        {
          key: 'srtf',
          label: 'Shortest Job First NonPre',
          style: { color: 'black' },
          className: 'on-forcus-items',
        },
      ],
    },
  ];//layout cac loai thuat toan

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClick: MenuProps['onClick'] = (e: any) => {
    setSelectedKey(e.key);
    resetTable();
    handleMenuItemClick();
  };//hàm xử lý click

  const renderForm = () => {
    switch (selectedKey) {
      //fcfs
      case 'fcfs':
        return <div className="bg-03 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Thời gian đến</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Thời gian xử lý</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="md:w-full"></div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-black text-white rounded-xl h-12 px-6">
             Kết quả
            </button></div>
        </div>;
      //sjf
      case 'sjf':
        return <div className="bg-03 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Thời gian đến</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Thời gian xử lý</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className=" md:w-full"></div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-black text-white rounded-xl h-12 px-6">
             Kết quả
            </button></div>
        </div>;
      //priority
      case 'pp':
        return <div className="bg-03 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Thời gian đến</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Thời gian xử lý</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Độ ưu tiên</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 3 2 4"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-black text-white rounded-xl h-12 px-6">
             Kết quả
            </button>
          </div>
        </div>;
      //non-preemptive-priority
      case 'npp':
        return <div className="bg-03 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1>Thời gian đến</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Thời gian xử lý</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Độ ưu tiên</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 3 2 4"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-black text-white rounded-xl h-12 px-6">
             Kết quả
            </button></div>
        </div>;
      //round-robin
      case 'rr':
        return <div className="bg-03 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Thời gian đến</h1>
            <input
              type="text"
              className="p-3 pl-5  md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Thời gian xử lý</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Thời gian xoay vòng</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 3"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-black text-white rounded-xl h-12 px-6">
             Kết quả
            </button></div>
        </div>;
      //srtf
      case 'srtf':
        return <div className="bg-03 p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="mx-2 md:w-full">
            <h1 >Thời gian đến</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-2 md:w-full">
            <h1>Thời gian xử lý</h1>
            <input
              type="text"
              className="p-3 pl-5 md:w-full my-2 border border-gray-300 rounded-3xl"
              placeholder="ví dụ: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className=" md:w-full"></div>
          <div className="flex flex-wrap justify-end content-center">
            <button
              onClick={handleSubmit}
              className="block bg-black text-white rounded-xl h-12 px-6">
             Kết quả
            </button></div>
        </div>;
      default:
        return null;
    }
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: `
      2px 2px 4px rgba(0, 0, 0, 0.3),
      4px 4px 8px rgba(0, 0, 0, 0.2)
    `,
  };

  return (
    <div className="h-screen">
      <button onClick={toggleSidebar} data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>
      <aside ref={sidebarRef} id="default-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-03 ">
          <div className="">
            <Menu
              onClick={onClick}
              className="bg-03"
              mode="inline"
              items={items} />
          </div>
        </div>
      </aside>
      <div className="md:h-full sm:ml-64 md:flex-col">
        <div className="px-32 py-6 content-start bg-black rounded-b-full mx-auto text-center md:w-auto md:h-auto">
          <p style={titleStyle} className="font-serif font-bold">Tìm hiểu công nghệ Jamstack và xây dựng ứng dụng Web minh họa các giải thuật định thời CPU</p>
        </div>
        <div className="md:h-auto">
          {renderForm()}
        </div>
        <div className="px-4 pb-12 md:h-auto">
          {result}
        </div>
      </div>
    </div>
  );
}
