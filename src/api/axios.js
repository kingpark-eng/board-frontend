import axios from "axios";

// axios.create 메서드 호출시
// 단순히 빈 객체를 주는 게 아니라, .get, .post, .put, .delete 같은 메서드가 전부 들어있는 axios 인스턴스를 만들어줌
const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => { 
    const token = localStorage.getItem("token"); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response
  , (error) => {
        if (error.response?.status===401){
            localStorage.removeItem("token");
            window.location.href="/login";
        }
        return Promise.reject(error);
    }
);

export default api;