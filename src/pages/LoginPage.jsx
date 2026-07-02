// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // form 기본 새로고침 막기

    setError("");
    setLoading(true);

    try {
      await login(email, password); 
      navigate("/"); // 성공 → 게시판 목록으로 
    } catch (err) {
      // 백엔드가 보낸 에러 메시지가 있으면 그걸, 없으면 기본 문구
      const message =
        err.response?.data?.message ?? "로그인에 실패했습니다. 다시 시도해주세요.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>로그인</h1>

        <label className={styles.label}>
          이메일
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className={styles.label}>
          비밀번호
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p className={styles.footer}>
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
