"use client";
<<<<<<< HEAD
import { useState } from "react";
// import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
// import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
=======
import { useEffect, useState } from "react";

>>>>>>> b4bdb4282c3177a7dfbc0005bfad776614db1b19
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
<<<<<<< HEAD

=======
import { ResponseData } from "@/types/api-response";
>>>>>>> b4bdb4282c3177a7dfbc0005bfad776614db1b19
interface TienTrinhPP {
  ma_tt: number;
  tg_cho: number;
  tg_denRL: number;
  tg_xuly: number;
  tg_hoantat: number;
  do_uu_tien: number;
  tg_cho_tb: number;
  tg_hoantat_tb: number;
}//khởi tạo interface cho tiến trình Priority Preemptive

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

interface TienTrinhSJF {
  tg_cho: number;
  tg_denRL: number;
  tg_xuly: number;
  tg_hoantat: number;
  tg_cho_tb: number;
  tg_hoantat_tb: number;
}//khởi tạo interface cho tiến trình SJF

interface TienTrinhSRTF {
  tg_cho: number;
  tg_denRL: number;
  tg_xuly: number;
  tg_hoantat: number;
  tg_cho_tb: number;
  tg_hoantat_tb: number;
}//khởi tạo interface cho tiến trình SRTF

interface TienTrinhRR {
  tg_cho: number;
  tg_denRL: number;
  tg_xuly: number;
  tg_hoantat: number;
  tg_cho_tb: number;
  tg_hoantat_tb: number;
  quantum: number;
}//khởi tạo interface cho tiến trình RR

const aPP: TienTrinhPP[] = []; //khai báo mảng a chứa các tiến trình
const aNPP: TienTrinhNPP[] = []; //khai báo mảng a chứa các tiến trình
const aFCFS: TienTrinhFCFS[] = []; //khai báo mảng a chứa các tiến trình
const aSJF: TienTrinhSJF[] = []; //khai báo mảng a chứa các tiến trình
const aSRTF: TienTrinhSRTF[] = []; //khai báo mảng a chứa các tiến trình
const aRR: TienTrinhRR[] = []; //khai báo mảng a chứa các tiến trình
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

  function hoandoi(b: number, c: number): [number, number] {
    return [c, b];
  }//hàm hoán đổi vị trí của 2 số

  // Hàm call API cho các thuật toán CPU
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

  function pp() {
    let sotientrinh: number;
    count = demthoigianden(arrivalTime);
    let kiemtra_tg_denRL = 0;
    let tg_tra_CPU = 0;
    let TongTG_cho = 0;
    let TongTG_hoantat = 0;
    // eslint-disable-next-line prefer-const
    sotientrinh = count;
    const tg_denRL = getCharactersWithoutSpaces(arrivalTime)
    const tg_xuly = getCharactersWithoutSpaces(burstTime)
    const do_uu_tien = getCharactersWithoutSpaces(priority)

    for (let i = 0; i < sotientrinh; i++) {
      aPP.push({
        ma_tt: i + 1,
        tg_cho: 0,
        tg_denRL: tg_denRL[i],
        tg_xuly: tg_xuly[i],
        tg_hoantat: 0,
        do_uu_tien: do_uu_tien[i],
        tg_cho_tb: 0,
        tg_hoantat_tb: 0,
      });

      if (i === 0) kiemtra_tg_denRL = aPP[i].tg_denRL;
      if (kiemtra_tg_denRL !== aPP[i].tg_denRL) kiemtra_tg_denRL = 1;
    }

    if (kiemtra_tg_denRL !== 0) {
      for (let i = 0; i < sotientrinh; i++) {
        for (let j = 0; j < sotientrinh - i - 1; j++) {
          if (aPP[j].tg_denRL > aPP[j + 1].tg_denRL) {
            [aPP[j].ma_tt, aPP[j + 1].ma_tt] = hoandoi(aPP[j].ma_tt, aPP[j + 1].ma_tt);
            [aPP[j].tg_denRL, aPP[j + 1].tg_denRL] = hoandoi(aPP[j].tg_denRL, aPP[j + 1].tg_denRL);
            [aPP[j].tg_xuly, aPP[j + 1].tg_xuly] = hoandoi(aPP[j].tg_xuly, aPP[j + 1].tg_xuly);
            [aPP[j].do_uu_tien, aPP[j + 1].do_uu_tien] = hoandoi(aPP[j].do_uu_tien, aPP[j + 1].do_uu_tien);
          }
        }
      }
    }
    if (kiemtra_tg_denRL !== 0) {
      aPP[0].tg_cho = aPP[0].tg_denRL;
      aPP[0].tg_hoantat = aPP[0].tg_xuly - aPP[0].tg_denRL;
      tg_tra_CPU = aPP[0].tg_hoantat;
      TongTG_cho += aPP[0].tg_cho;
      TongTG_hoantat += aPP[0].tg_hoantat;

      for (let i = 1; i < sotientrinh; i++) {
        let min = aPP[i].do_uu_tien;
        for (let j = i + 1; j < sotientrinh; j++) {
          if (min > aPP[j].do_uu_tien && aPP[j].tg_denRL <= tg_tra_CPU) {
            min = aPP[j].do_uu_tien;
            [aPP[i].ma_tt, aPP[j].ma_tt] = hoandoi(aPP[i].ma_tt, aPP[j].ma_tt);
            [aPP[i].tg_denRL, aPP[j].tg_denRL] = hoandoi(aPP[i].tg_denRL, aPP[j].tg_denRL);
            [aPP[i].tg_xuly, aPP[j].tg_xuly] = hoandoi(aPP[i].tg_xuly, aPP[j].tg_xuly);
            [aPP[i].do_uu_tien, aPP[j].do_uu_tien] = hoandoi(aPP[i].do_uu_tien, aPP[j].do_uu_tien);
          }
        }
        aPP[i].tg_cho = tg_tra_CPU - aPP[i].tg_denRL;
        TongTG_cho += aPP[i].tg_cho;
        tg_tra_CPU += aPP[i].tg_xuly;
        aPP[i].tg_hoantat = tg_tra_CPU - aPP[i].tg_denRL;
        TongTG_hoantat += aPP[i].tg_hoantat;
      }
    } else {
      for (let i = 0; i < sotientrinh; i++) {
        let min = aPP[i].do_uu_tien;
        for (let j = i + 1; j < sotientrinh; j++) {
          if (min > aPP[j].do_uu_tien && aPP[j].tg_denRL <= tg_tra_CPU) {
            min = aPP[j].do_uu_tien;
            [aPP[i].ma_tt, aPP[j].ma_tt] = hoandoi(aPP[i].ma_tt, aPP[j].ma_tt);
            [aPP[i].tg_denRL, aPP[j].tg_denRL] = hoandoi(aPP[i].tg_denRL, aPP[j].tg_denRL);
            [aPP[i].tg_xuly, aPP[j].tg_xuly] = hoandoi(aPP[i].tg_xuly, aPP[j].tg_xuly);
            [aPP[i].do_uu_tien, aPP[j].do_uu_tien] = hoandoi(aPP[i].do_uu_tien, aPP[j].do_uu_tien);
          }
        }
        aPP[i].tg_cho = tg_tra_CPU - aPP[i].tg_denRL;
        tg_tra_CPU += aPP[i].tg_xuly;
        aPP[i].tg_hoantat = tg_tra_CPU - aPP[i].tg_denRL;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        TongTG_cho += aPP[i].tg_cho;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        TongTG_hoantat += aPP[i].tg_hoantat;

        aPP[0].tg_cho_tb = TongTG_cho / sotientrinh;
        aPP[0].tg_hoantat_tb = TongTG_hoantat / sotientrinh;
      }
    }
  }//Hàm xử lý bài toán Priority Preemptive

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

  function fcfs() {
    count = demthoigianden(arrivalTime);
    const TG_XuLy = getCharactersWithoutSpaces(burstTime)
    let So_TienTrinh: number;
    // eslint-disable-next-line prefer-const
    So_TienTrinh = count;
    for (let i = 0; i < So_TienTrinh; i++) {
      aFCFS.push({
        tg_cho: 0,
        tg_denRL: getCharactersWithoutSpaces(arrivalTime)[i],
        tg_hoantat: 0,
        tg_xuly: TG_XuLy[i],
        tg_cho_tb: 0,
        tg_hoantat_tb: 0,
      })
    }
    aFCFS[0].tg_cho = 0;
    for (let i = 1; i < So_TienTrinh; i++) {
      aFCFS[i].tg_cho = 0;
      for (let j = 0; j < i; j++) {
        aFCFS[i].tg_cho += aFCFS[j].tg_xuly
      }
    }

    for (let i = 0; i < So_TienTrinh; i++) {
      aFCFS[i].tg_hoantat = aFCFS[i].tg_xuly + aFCFS[i].tg_cho;
      aFCFS[0].tg_cho_tb += aFCFS[i].tg_cho;
      aFCFS[0].tg_hoantat_tb += aFCFS[i].tg_hoantat;
    }
    aFCFS[0].tg_cho_tb /= So_TienTrinh;
    aFCFS[0].tg_hoantat_tb /= So_TienTrinh;
  }//Hàm xử lý bài toán FCFS

  function sjf() {
    let tam: number;
    let tong = 0;
    let vitri: number;
    const tgxl = getCharactersWithoutSpaces(burstTime);
    const tt: number[] = [];
    let soTT: number;
    count = demthoigianden(arrivalTime);
    // eslint-disable-next-line prefer-const
    soTT = count;

    for (let i = 0; i < soTT; i++) {
      aSJF.push({
        tg_cho: 0,
        tg_denRL: getCharactersWithoutSpaces(arrivalTime)[i],
        tg_hoantat: 0,
        tg_xuly: tgxl[i],
        tg_cho_tb: 0,
        tg_hoantat_tb: 0,
      })
      tt[i] = i + 1;
    }

    for (let i = 0; i < soTT; i++) {
      vitri = i;
      for (let j = i + 1; j < soTT; j++) {
        if (aSJF[j].tg_xuly < aSJF[vitri].tg_xuly) {
          vitri = j;
        }
      }
      tam = aSJF[i].tg_xuly;
      aSJF[i].tg_xuly = aSJF[vitri].tg_xuly;
      aSJF[vitri].tg_xuly = tam;
      tam = tt[i];
      tt[i] = tt[vitri];
      tt[vitri] = tam;
    }

    aSJF[0].tg_cho = 0;
    for (let i = 1; i < soTT; i++) {
      aSJF[i].tg_cho = 0;
      for (let j = 0; j < i; j++) {
        aSJF[i].tg_cho += aSJF[j].tg_xuly;
      }
      tong += aSJF[i].tg_cho;
    }
    aSJF[0].tg_cho_tb = tong / soTT;
    tong = 0;
    console.log("\nTien trinh\tTG Xu ly\tTG cho\t\tTG hoan tat\n");
    for (let i = 0; i < soTT; i++) {
      aSJF[i].tg_hoantat = aSJF[i].tg_xuly + aSJF[i].tg_cho;
      tong += aSJF[i].tg_hoantat;
    }
    aSJF[0].tg_hoantat_tb = tong / soTT;
  }//Hàm xử lý bài toán SJF

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

<<<<<<< HEAD
  function rr() {
    const tamTT: number[] = [];
    const tamDen: number[] = [];
    const tien_trinh_nghi: number[] = [];
    const tt: number[] = [];
    const vtcu: number[] = [];
    let sl_tt: number;
    let sl: number;
    count = demthoigianden(arrivalTime);
    // eslint-disable-next-line prefer-const
    sl_tt = count;
    for (let i = 0; i < sl_tt; i++) {
      aRR.push({
        tg_cho: 0,
        tg_denRL: getCharactersWithoutSpaces(arrivalTime)[i],
        tg_xuly: getCharactersWithoutSpaces(burstTime)[i],
        tg_hoantat: 0,
        tg_cho_tb: 0,
        tg_hoantat_tb: 0,
        quantum: getCharactersWithoutSpaces(timeQuantum)[i],
      })
      tamTT[i] = aRR[i].tg_xuly;
      tt[i] = i + 1;
      tamDen[i] = aRR[i].tg_denRL;
    }

    function xoa(vt: number) {
      for (let i = vt; i < sl - 1; i++) {
        tamTT[i] = tamTT[i + 1];
        tamDen[i] = tamDen[i + 1];
        vtcu[i] = vtcu[i + 1];
      }
      sl--;
    }

    function chen(vt: number, gt: number, gtden: number, gtvtcu: number) {
      for (let i = sl; i > vt; i--) {
        tamTT[i] = tamTT[i - 1];
        tamDen[i] = tamDen[i - 1];
        vtcu[i] = vtcu[i - 1];
      }
      tamTT[vt] = gt;
      tamDen[vt] = gtden;
      vtcu[vt] = gtvtcu;
      sl++;
    }
    aRR[0].tg_hoantat_tb = 0;
    aRR[0].tg_cho_tb = 0;
    aRR[0].tg_cho = 0;
    let tong_tg_chay = 0;

    for (let i = 0; i < sl_tt; i++) {
      for (let j = i + 1; j < sl_tt; j++) {
        if (aRR[i].tg_denRL > aRR[j].tg_denRL) {
          let t = aRR[i].tg_denRL;
          aRR[i].tg_denRL = aRR[j].tg_denRL;
          aRR[j].tg_denRL = t;
          t = aRR[i].tg_xuly;
          aRR[i].tg_xuly = aRR[j].tg_xuly;
          aRR[j].tg_xuly = t;
          t = tt[i];
          tt[i] = tt[j];
          tt[j] = t;
          tien_trinh_nghi[i] = 0;
        }
      }
      vtcu[i] = i;
      tamTT[i] = aRR[i].tg_xuly;
      tamDen[i] = aRR[i].tg_denRL;
=======
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
>>>>>>> b4bdb4282c3177a7dfbc0005bfad776614db1b19
    }
  }

    sl = sl_tt;
    while (sl > 0) {
      aRR[vtcu[0]].tg_cho += tong_tg_chay - tamDen[0] - tien_trinh_nghi[vtcu[0]];
      tamDen[0] = 0;

      if (tamTT[0] > aRR[0].quantum) {
        tong_tg_chay += aRR[0].quantum;
        tien_trinh_nghi[vtcu[0]] = tong_tg_chay;
        tamTT[0] -= aRR[0].quantum;
        let j = 1;
        while (tamDen[j] < tong_tg_chay && j < sl) j++;
        if (tamDen[j] != tong_tg_chay) j = sl;
        chen(j, tamTT[0], tamDen[0], vtcu[0]);
        xoa(0);
      } else {
        tong_tg_chay += tamTT[0];
        aRR[0].tg_cho_tb += aRR[vtcu[0]].tg_cho_tb;
        aRR[vtcu[0]].tg_hoantat = tong_tg_chay - aRR[vtcu[0]].tg_denRL;
        aRR[0].tg_hoantat_tb += aRR[vtcu[0]].tg_hoantat;
        xoa(0);
      }
    }

    aRR[0].tg_hoantat_tb /= sl_tt;
    aRR[0].tg_cho_tb /= sl_tt;
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
    aSJF.splice(0, aSJF.length);
  }//hàm reset bảng

  const handleSubmit = async () => {
    resetTable();
    let output: JSX.Element | null = null;
    if (selectedKey === "fcfs") {
      fcfs()
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
                  {aFCFS.map((process, index) => (
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
              <p>Thời gian chờ trung bình: {aFCFS[0].tg_cho_tb}</p>
              <p>Thời gian hoàn tất trung bình: {aFCFS[0].tg_hoantat_tb}</p>
            </div>}
        </div>
      );
      setResult(output);
      resetForm();
    }//Xử lý bài toán FCFS
    if (selectedKey === "sjf") {
      sjf()
      output = (
        <div>
          {<div>
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
                {aSJF.map((process, index) => (
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
          <p>Thời gian chờ trung bình: {aSJF[0].tg_cho_tb}</p>
          <p>Thời gian hoàn tất trung bình: {aSJF[0].tg_hoantat_tb}</p>
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
<<<<<<< HEAD
    }//Xử lý bài toán SRTF
    if (selectedKey === "rr") {
      rr()
=======
    }
    if (selectedAlgorithm === "rr") {
      await rr();
>>>>>>> b4bdb4282c3177a7dfbc0005bfad776614db1b19
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
<<<<<<< HEAD
                  <TableColumn>Turn Around Time</TableColumn>
                  <TableColumn>Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {aRR.map((process, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">{process.tg_denRL}</TableCell>
                      <TableCell className="text-center">{process.tg_xuly}</TableCell>
                      <TableCell className="text-center">{process.tg_hoantat}</TableCell>
                      <TableCell className="text-center">{process.tg_hoantat - process.tg_denRL}</TableCell>
                      <TableCell className="text-center">{process.tg_cho}</TableCell>
=======
                  <TableColumn>Waiting Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {(responseData?.data?.processes || []).map(process => (
                    <TableRow key={process.id}>
                      <TableCell className="text-center">{process.id}</TableCell>
                      <TableCell className="text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="text-center">{process.burstTime}</TableCell>
                      <TableCell className="text-center">{process.finishTime}</TableCell>
                      <TableCell className="text-center">{process.waitingTime}</TableCell>
>>>>>>> b4bdb4282c3177a7dfbc0005bfad776614db1b19
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
<<<<<<< HEAD
            </div>}
          <p>Thời gian chờ trung bình: {aRR[0].tg_cho_tb}</p>
          <p>Thời gian hoàn tất trung bình: {aRR[0].tg_hoantat_tb}</p>
=======
              <p>Thời gian chờ trung bình: {responseData?.data?.averageWaitingTime}</p>
              <p>Thời gian hoàn tất trung bình: {responseData?.data?.averageFinishTime}</p>
            </div>
          }
>>>>>>> b4bdb4282c3177a7dfbc0005bfad776614db1b19
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
      pp()
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
              {aPP.map((item) => (
                <TableRow key={item.ma_tt}>
                  <TableCell className="text-center">{item.ma_tt}</TableCell>
                  <TableCell className="text-center">{item.tg_denRL}</TableCell>
                  <TableCell className="text-center">{item.tg_xuly}</TableCell>
                  <TableCell className="text-center">{item.tg_hoantat}</TableCell>
                  <TableCell className="text-center">{item.tg_cho}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="m-2">Thời gian chờ trung bình của các tiến trình: {aPP[0].tg_cho_tb}</p>
          <p>Thời gian hoàn tất trung bình của các tiến trình: {aPP[0].tg_hoantat_tb}</p>
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
          key: 'priority',
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
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  };

  const renderForm = () => {
    switch (selectedKey) {
      //fcfs
      case 'fcfs':
        return <div className="static flex ml-6 my-3">
          <div className="mx-3">
            <h1 >Arrival Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="absolute bottom-2 right-3 mr-3 block my-5 p-3 bg-red-800 text-white rounded-xl">
            Submit
          </button>
        </div>;
      //sjf
      case 'sjf':
        return <div className="static flex ml-6 my-3">
          <div className="mx-3">
            <h1>Arrival Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="absolute bottom-2 right-3 mr-3 block my-5 p-3 bg-red-800 text-white rounded-xl">
            Submit
          </button>
        </div>;
      //priority
      case 'priority':
        return <div className="static flex ml-6 my-3">
          <div className="mx-3">
            <h1>Arrival Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Priorities</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="Lower #= Higher"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="absolute bottom-2 right-3 mr-3 block my-5 p-3 bg-red-800 text-white rounded-xl">
            Submit
          </button>
        </div>;
      //non-preemptive-priority
      case 'npp':
        return <div className="flex static ml-6 my-3">
          <div className="mx-3">
            <h1>Arrival Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Priorities</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="Lower #= Higher"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="absolute bottom-2 right-3 mr-3 block my-5 p-3 bg-red-800 text-white rounded-xl">
            Submit
          </button>
        </div>;
      //round-robin
      case 'rr':
        return <div className="static flex ml-6 my-3">
          <div className="mx-3">
            <h1>Arrival Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Time Quantum</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 3"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="absolute bottom-2 right-3 mr-3 block my-5 p-3 bg-red-800 text-white rounded-xl">
            Submit
          </button>
        </div>;
      //srtf
      case 'srtf':
        return <div className="flex static ml-6 my-3">
          <div className="mx-3">
            <h1>Arrival Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
          <div className="mx-3">
            <h1>Burst Time</h1>
            <input
              type="text"
              className="block p-3 pl-5 my-2 border border-gray-300 rounded-3xl"
              placeholder="eg: 1 4 5 6"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="absolute bottom-2 right-3 mr-3 block my-5 p-3 bg-red-800 text-white rounded-xl">
            Submit
          </button>
        </div>;
      default:
        return null;
    }
  };

  return (
<<<<<<< HEAD
    <div style={{ position: 'relative', height: '100vh' }}>
      <Menu
        onClick={onClick}
        style={{
          width: 260,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: '#cfe1b9',
        }}
        mode="inline"
        items={items}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 300,
      }}>
        <h1 className="text-3xl font-bold mt-5">CPU Scheduling & Jamstack</h1>
=======
    <main className="flex p-8 gap-8 row-start-1 max-h-32 sm:items-start">
      <div className="flex-auto flex flex-col p-4">
        <h1 className="text-xl text-white text-center pb-8 sm:text-4xl font-bold">
          Tìm hiểu công nghệ Jamstack và xây dựng ứng dụng Web minh họa các giải thuật định thời CPU
        </h1>
        <div className="max-h-full p-5 block rounded-3xl bg-white max-w-full container">
          {result}
        </div>
>>>>>>> b4bdb4282c3177a7dfbc0005bfad776614db1b19
      </div>
      <div style={{
        position: 'absolute',
        top: 80,
        right: 0,
        width: 1012,
        height: 413,
      }}>
        <div className="ml-5">{result}</div>
      </div>
        
      <div
        className="flex"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          backgroundColor: '#cfe1b9',
        }}>
        {renderForm()}
      </div>
    </div>
  );
}
