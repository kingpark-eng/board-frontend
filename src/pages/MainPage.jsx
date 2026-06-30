import { useNavigate } from "react-router-dom";

function MainPage(){
    const navigate = useNavigate();

    const moveRoutine = ()=>{
        const token = localStorage.getItem("token");

        if(!token){
            alert("로그인 후 이용해주세요.");
            navigate("/login");
            return;
        }

        navigate("/api/routines");
    }

    return <>
        <button onClick={()=>navigate("/")}>메인</button>
        <button onClick={()=>navigate("/posts")}>게시글</button>
        <button onClick={moveRoutine}>루틴</button>
    </>

}

export default MainPage