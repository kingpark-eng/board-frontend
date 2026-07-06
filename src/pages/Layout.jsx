import { NavLink, Link, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
import { useAuth } from "../context/AuthContext";

// 로고 아이콘 (체크박스 모티브)
function LogoIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#4f8ef7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}

// 헤더 + 푸터로 페이지를 감싸는 레이아웃.
// App.js에서 <Layout><Routes/></Layout> 형태로 쓰거나,
// react-router의 <Outlet/>과 조합해 사용하세요.
export default function Layout({ children }) {
  const navigate = useNavigate();
  const {user, logout, isLoggedIn} = useAuth();
  const nickname = user?.nickname;
  // 실제로는 AuthContext에서 가져오세요.
//   const { nickname, isLoggedIn, logout } = useAuthFallback();
 
  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  return (
    <div className={styles.layout}>
      {/* ── 헤더 ── */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <LogoIcon />
          </span>
          <span className={styles.logoText}>루티너리</span>
        </Link>

        <nav className={styles.nav}>
          {/* end 옵션: "/" 는 정확히 일치할 때만 active */}
          <NavLink to="/" end className={navClass}>메인</NavLink>
          <NavLink to="/history" className={navClass}>기록</NavLink>
        </nav>

        <div className={styles.userArea}>
          {isLoggedIn ? (
            <>
              <span className={styles.userInfo}>
                <span className={styles.avatar}>
                  {nickname?.[0] ?? "U"}
                </span>
                {nickname}님
              </span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.logoutBtn}>
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* ── 본문 ── */}
      <main className={styles.main}>{children}</main>

      {/* ── 푸터 ── */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <span className={styles.footerIcon}>
            <LogoIcon size={14} />
          </span>
          루티너리 · 작은 습관이 큰 변화를 만듭니다
        </div>
        <nav className={styles.footerNav}>
          <Link to="/">메인</Link>
          <Link to="/history">기록</Link> 
        </nav>
        <div className={styles.footerCopy}>© 2026 Routinary</div>
      </footer>
    </div>
  );
}

// ── AuthContext 대체용 임시 훅 ──
// 실제로는 이 함수를 지우고 상단에서
//   import { useAuth } from "../context/AuthContext";
// 를 가져와 useAuth()를 쓰세요.
// function useAuthFallback() {
    
//   return { nickname: "kingp", isLoggedIn: true, logout: () => {} };
// }