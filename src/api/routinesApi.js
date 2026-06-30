// src/api/routines.js
import api from "./axios";

export function getRoutines(){
    return api.get("/api/routines");
}

export const createRoutines=(data)=>{
    return api.post("/api/routines". data).then(res=>res.data);
}

// export function toggleDone(){
//     return api.get("/api/routines");
// }

// export function deleteRoutine(){
//     return api.get("/api/routines");
// }