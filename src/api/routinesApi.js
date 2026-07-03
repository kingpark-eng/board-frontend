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

}

// export function toggleDone(){
//     return api.get("/api/routines");
// }

// export function deleteRoutine(){
//     return api.get("/api/routines");
// }