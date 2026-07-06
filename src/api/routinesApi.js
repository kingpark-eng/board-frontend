// src/api/routines.js
import api from "./axios";

export function getRoutines(){
    return api.get("/api/routines");
}

export const addRoutine=(data)=>{
    const json = {
        "title" : data
    };
    return api.post("/api/routines", json).then(res=>res.data);
}

export const toggleRoutineLog=(id)=>{
    const json = {
        "id" : id
    };

    return api.post("/api/routinelog", json).then(res=>res.data);
}

export const getMonthlyLogs=(year, month)=>{
    return api.get("/api/routinelog/monthlyLogs", {
        params: {
            year, month
        }
    });
}

export const getDayLogs=(logDate)=>{
    console.log(logDate);
    return api.get("/api/routinelog/dayLogs", {
        params: {
            "logDate" : logDate
        }
    })
}
// export function toggleDone(){
//     return api.get("/api/routines");
// }

// export function deleteRoutine(){
//     return api.get("/api/routines");
// }