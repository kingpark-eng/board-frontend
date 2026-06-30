import {useEffect, useState} from "react"
import {getRoutines, createRoutines} from "../api/routinesApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function RoutineListPage(){
    const navigate = useNavigate();
    const { register } = useAuth();
    const [title, setTitle] = useState("");
    // const [loading, setLoading] = useState(false);
    const[routines, setRoutines] = useState([]);
    
    useEffect(()=>{
        getRoutines().then((data)=>{
            console.log(data);
            // setRoutines(data);
        });
    }, []);

    const submit= async(e)=>{
        e.preventDefault(); 
        try {
            const created = await createRoutines(title);
            console.log(created);
            setRoutines([...routines, created]);
            setTitle("");
        } catch (error) {
            
        }
    };

    return <>
        <div>
            list 영역<br/>

            write 영역
            <form onSubmit={submit}>
                <div>
                    루틴 제목 : <input type="text" name="title" value={title} onChange={(e)=>setTitle(e.target.value)}></input>
                </div>
                <button type="submit">추가</button>
            </form>
        </div>
    
    </>
}

export default RoutineListPage;
