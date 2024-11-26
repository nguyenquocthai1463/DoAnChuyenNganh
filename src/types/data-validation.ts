
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateTheLengthOfProcesses = (arrArrivalTime: any, arrBurstTime: any) => {
    if (!Array.isArray(arrArrivalTime) || arrArrivalTime.length === 0 ||
        !Array.isArray(arrBurstTime) || arrBurstTime.length === 0)
        return false;
    return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateArrivalTimeAndBurstTime = (arrArrivalTime: any, arrBurstTime: any) => {
    return (arrArrivalTime.length !== arrBurstTime.length) ? false : true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateArrivalTimeBurstTimeAndPriority = (arrArrivalTime: any, arrBurstTime: any, arrPriority: any) => {
    return (arrArrivalTime.length !== arrPriority.length ||
        arrBurstTime.length !== arrPriority.length) ? false : true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateThatEachElementInTheProcessesIsNumeric = (arrArrivalTime: any, arrBurstTime: any, arrPriority: any): [boolean, string] => {
    if (typeof arrPriority === 'undefined') {
        for (let i = 0; i < arrArrivalTime.length; i++) {
            if (isNaN(Number(arrArrivalTime[i])) || Number(arrArrivalTime[i]) < 0 ||
                isNaN(Number(arrBurstTime[i])) || Number(arrBurstTime[i]) < 0)
                return [false, "Each element in arrival times and burst times should be positive numbers."];
        }
    } else {
        for (let i = 0; i < arrArrivalTime.length; i++) {
            if (isNaN(Number(arrArrivalTime[i])) || Number(arrArrivalTime[i]) < 0 ||
                isNaN(Number(arrBurstTime[i])) || Number(arrBurstTime[i]) < 0 ||
                isNaN(Number(arrPriority[i])) || Number(arrPriority[i]) < 0)
                return [false, "Each element in arrival times, burst times and priorities should be positive numbers."];
        }
    }
    return [true, ""];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateQuantum = (quantum: any) => {
    return (isNaN(Number(quantum)) || Number(quantum) <= 0) ? false : true;
}

export {
    validateTheLengthOfProcesses,
    validateArrivalTimeAndBurstTime,
    validateArrivalTimeBurstTimeAndPriority,
    validateThatEachElementInTheProcessesIsNumeric,
    validateQuantum
};