// src/components/common/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        게시판
      </Link>

      <nav className={styles.nav}>
        {isAuthenticated ? (
          <>
            <span className={styles.nickname}>{user.nickname}님</span>
            <button className={styles.logoutBtn} onClick={logout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>
              로그인
            </Link>
            <Link to="/register" className={styles.signupBtn}>
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
