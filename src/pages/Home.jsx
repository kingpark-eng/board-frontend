import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import RoutinePanel from "./RoutinePanel";
import PostPanel from "./PostPanel";

function getTimeTheme() {
  const h = new Date().getHours();
  if (h < 6)  return { key: "dawn",    greeting: "고요한 새벽이에요",   glow: "#7c5cbf", sky: "#1a1f3a" };
  if (h < 12) return { key: "morning", greeting: "좋은 아침이에요",     glow: "#f0a940", sky: "#243b5e" };
  if (h < 18) return { key: "day",     greeting: "활기찬 오후네요",     glow: "#4f8ef7", sky: "#2a4a6e" };
  return           { key: "evening", greeting: "하루를 마무리할 시간", glow: "#7c5cbf", sky: "#1f2436" };
}

export default function Home({ nickname = "kingp" }) {
  const [theme, setTheme] = useState(getTimeTheme());

  useEffect(() => {
    const t = setInterval(() => setTheme(getTimeTheme()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  // 히어로의 진행률 링 — 실제로는 오늘 RoutineLog 집계값으로 교체
  const done = 3, total = 5;
  const percent = total ? done / total : 0;
  const R = 32;
  const CIRC = 2 * Math.PI * R;

  return (
    <div className={styles.page}>
      {/* ── 히어로 ── */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.greeting}>{theme.greeting}</div>
          <h1 className={styles.heroTitle}>
            {nickname}님, 오늘의 루틴을 시작해볼까요?
          </h1>
        </div>

        <svg className={styles.heroArt} width="108" height="108" viewBox="0 0 108 108">
          <circle className={styles.ringTrack} cx="54" cy="54" r={R} />
          <circle
            className={styles.ringFill}
            cx="54" cy="54" r={R}
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - percent)}
          />
          <text className={styles.ringLabel} x="54" y="59" textAnchor="middle">
            {Math.round(percent * 100)}%
          </text>
        </svg>
      </div>

      {/* ── 2단: 왼쪽 루틴 / 오른쪽 게시판 ── */}
      <div className={styles.grid}>
        <RoutinePanel />
        <PostPanel limit={5} />
      </div>
    </div>
  );
}