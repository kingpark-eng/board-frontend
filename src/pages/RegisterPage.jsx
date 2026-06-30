// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./RegisterPage.module.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setError("");

    // 1. 비밀번호 일치 확인 (프론트 검증)
    if (password !== passwordConfirm) { 
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 2. 비밀번호 길이 검증 (예시)
    if (password.length < 8) { 
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
 
    setLoading(true);
    try {
      await register({ email, nickname, password });
      navigate("/"); // 성공 → 목록으로 (register가 자동 로그인 처리하는 경우)
    } catch (err) {
      const message =
        err.response?.data?.message ?? "회원가입에 실패했습니다. 다시 시도해주세요.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>회원가입</h1>

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
          닉네임
          <input
            className={styles.input}
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="사용할 닉네임"
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
            placeholder="8자 이상"
            required
          />
        </label>

        <label className={styles.label}>
          비밀번호 확인
          <input
            className={styles.input}
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 재입력"
            required
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>

        <p className={styles.footer}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
