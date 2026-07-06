//지갑 (로그인 상태 판단)
import { createContext, useContext, useState, useEffect} from 'react';
import api from '../api/axios';

// 1. 빈 지갑 틀
const AuthContext = createContext(null);

// 2. 실제 상태를 담아 자식들에게 뿌려주는 Provider
// AuthProvider 컴포넌트   — 실제 상태(user, token)와 함수(login, logout)를 담는 곳
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token"); 
        if (token) {
            api.get("/api/auth/me")
                .then((res) => setUser(res.data))
                .catch(() => localStorage.removeItem("token"))
                .finally(() => {setLoading(false); setIsLoggedIn(true)});
        }else{
            setLoading(false);
        }
    }, []); 

    const login = async (email, password) => {
        const res = await api.post("/api/auth/login", {email, password});
        localStorage.setItem("token", res.data.token);
        setUser(res.data);
        setIsLoggedIn(true);
    }

    const logout = ()=>{
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
    }

    const register = async({email, nickname, password})=>{ 
        const res = await api.post("/api/auth/register", {email, nickname, password});
        localStorage.setItem("token", res.data.token);
        setUser(res.data);
        setIsLoggedIn(false);
    }

    

    const value = {
         user
        ,login
        ,logout
        ,register
        ,isLoggedIn
        ,loading
        ,isAuthenticated: !!user
    }

    return (
        //지갑에 내용물을 넣는 과정
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

//어느 컴포넌트서든 지갑을 꺼내는 편한 통로
export function useAuth(){
    //useContext는 저장소에서 값을 꺼내는 동작
    return useContext(AuthContext);
}
