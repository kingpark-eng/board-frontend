import { useState, useEffect, useMemo } from "react";
import styles from "./RoutineHistory.module.css";
// import { getMonthlyLogs, getDayLogs } from "../api/routinesApi";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// YYYY-MM-DD (로컬 기준) — toISOString은 UTC라 날짜가 밀릴 수 있어 직접 포맷
function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 완료율(0~1) → 초록 배경. 0이면 '없음' 스타일로 넘김
function heatStyle(ratio) {
  if (ratio <= 0) return null;
  // 0.15 ~ 1.0 사이로 매핑해서 조금만 해도 눈에 보이게
  const alpha = 0.15 + ratio * 0.85;
  return {
    background: `rgba(62, 207, 142, ${alpha})`,
    color: alpha > 0.5 ? "#0f1117" : "var(--text)",
    fontWeight: alpha > 0.5 ? 500 : 400,
  };
}

export default function RoutineHistory() {
  // 보고 있는 달의 첫날
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selected, setSelected] = useState(null); // "YYYY-MM-DD"
  const [monthData, setMonthData] = useState({}); // { "2026-07-08": { done, total } }
  const [dayLogs, setDayLogs] = useState([]);      // [{ id, title, done }]

  const year = cursor.getFullYear();
  const month = cursor.getMonth(); // 0-based
  const todayStr = ymd(new Date());

  // 이번 달 완료율 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      // const res = await getMonthlyLogs(year, month + 1);
      // if (alive) setMonthData(res.data);

      // ── 데모 데이터 (API 연동 시 위로 교체) ──
      const demo = {};
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        if (key > todayStr) continue; // 미래는 비움
        const total = 5;
        const done = Math.floor(Math.random() * 6); // 0~5 데모
        demo[key] = { done, total };
      }
      if (alive) setMonthData(demo);
    })();
    return () => { alive = false; };
  }, [year, month]); // eslint-disable-line react-hooks/exhaustive-deps

  // 날짜 선택 시 그날 루틴 목록 로드
  useEffect(() => {
    if (!selected) return;
    let alive = true;
    (async () => {
      // const res = await getDayLogs(selected);
      // if (alive) setDayLogs(res.data);

      // ── 데모: 완료 개수만큼 done 처리 ──
      const info = monthData[selected] ?? { done: 0, total: 5 };
      const names = ["물 2L 마시기", "아침 스트레칭 10분", "저녁 공부 1시간", "영양제 챙기기", "일기 쓰기"];
      const logs = names.map((title, i) => ({ id: i + 1, title, done: i < info.done }));
      if (alive) setDayLogs(logs);
    })();
    return () => { alive = false; };
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  // 달력 셀 배열 (앞쪽 빈칸 + 날짜)
  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay(); // 0=일
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < firstWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [year, month]);

  const moveMonth = (delta) => {
    setCursor(new Date(year, month + delta, 1));
    setSelected(null);
  };

  const selectedInfo = selected ? monthData[selected] : null;

  return (
    <div className={styles.page}>
      {/* 상단 */}
      <div className={styles.head}>
        <div className={styles.title}>
          <CalendarIcon />
          루틴 기록
        </div>
        <div className={styles.monthNav}>
          <button className={styles.navBtn} onClick={() => moveMonth(-1)} aria-label="이전 달">‹</button>
          <span className={styles.monthLabel}>{year}년 {month + 1}월</span>
          <button className={styles.navBtn} onClick={() => moveMonth(1)} aria-label="다음 달">›</button>
        </div>
      </div>

      {/* 요일 */}
      <div className={styles.weekHead}>
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={i === 0 ? styles.sun : i === 6 ? styles.sat : ""}>{w}</div>
        ))}
      </div>

      {/* 달력 */}
      <div className={styles.grid}>
        {cells.map((day, idx) => {
          if (day === null)
            return <div key={`e${idx}`} className={`${styles.cell} ${styles.empty}`} />;

          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const info = monthData[key];
          const ratio = info && info.total ? info.done / info.total : 0;
          const isFuture = key > todayStr;
          const heat = heatStyle(ratio);

          const cls = [
            styles.cell,
            isFuture ? styles.future : "",
            !isFuture && !heat ? styles.none : "",
            key === todayStr ? styles.today : "",
            key === selected ? styles.selected : "",
          ].filter(Boolean).join(" ");

          return (
            <div
              key={key}
              className={cls}
              style={heat ?? undefined}
              onClick={() => !isFuture && setSelected(key)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className={styles.legend}>
        <span>적음</span>
        <span className={styles.legendBox} style={{ background: "rgba(62,207,142,0.2)" }} />
        <span className={styles.legendBox} style={{ background: "rgba(62,207,142,0.45)" }} />
        <span className={styles.legendBox} style={{ background: "rgba(62,207,142,0.7)" }} />
        <span className={styles.legendBox} style={{ background: "rgba(62,207,142,1)" }} />
        <span>많음</span>
      </div>

      {/* 날짜 상세 */}
      {selected ? (
        <div className={styles.detail}>
          <div className={styles.detailHead}>
            <span className={styles.detailDate}>{formatKorean(selected)}</span>
            <span className={selectedInfo?.done ? styles.detailRatio : styles.detailRatioZero}>
              {selectedInfo?.done ?? 0}/{selectedInfo?.total ?? 0} 완료
            </span>
          </div>
          {dayLogs.length === 0 ? (
            <div className={styles.detailEmpty}>이 날은 기록이 없습니다.</div>
          ) : (
            <div className={styles.logList}>
              {dayLogs.map((log) => (
                <div key={log.id} className={`${styles.logItem} ${log.done ? styles.logDone : styles.logUndone}`}>
                  <span className={styles.logIcon}>{log.done ? <CheckCircle /> : <EmptyCircle />}</span>
                  <span className={styles.logText}>{log.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.hint}>
          날짜를 클릭하면 그날 완료한 루틴을 볼 수 있어요.
        </div>
      )}
    </div>
  );
}

// "2026-07-08" → "7월 8일 (화)"
function formatKorean(key) {
  const [y, m, d] = key.split("-").map(Number);
  const wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${m}월 ${d}일 (${wd})`;
}

/* 아이콘 */
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#3ecf8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}
function EmptyCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#5a6180" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}