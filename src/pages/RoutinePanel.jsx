import { useState, useEffect } from "react";
import styles from "./Home.module.css"; 
import routineStyles from "./RoutinePanel.module.css";

// 오늘의 루틴 패널.
// compact=true 로 넘기면 메인 대시보드용(입력창 유지, 여백 축소),
// 전용 /routines 페이지에서도 그대로 재사용할 수 있습니다.
export default function RoutinePanel({routines, onToggle, loading, add, del}) {
  // const [routines, setRoutines] = useState([]);
  const [input, setInput] = useState("");

  // useEffect(() => {
  //   let alive = true;
  //   (async () => {
  //     try {
  //       const res = await getRoutines();
  //       // if (alive) setRoutines(res.data);
  //     } finally {
  //       // if (alive) setLoading(false);
  //     }
  //     console.log(routines + " 3");
  //   })();
  //   return () => {
  //     alive = false;
  //   };
  // }, []); 
  console.log(routines);
  const doneCount = (routines ?? []).filter((r) => r?.done).length;  
  const total = routines.length;
  const percent = total ? Math.round((doneCount / total) * 100) : 0;

  // const toggle = async (id) => {
  //   // 낙관적 업데이트: UI 먼저 바꾸고 실패 시 롤백
  //   setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  //   try { 
  //     await toggleRoutineLog(id); 
  //   } catch { /* 롤백 처리 */  
  //     setRoutines((prev) =>
  //     prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
  //   )}
  // };
 
  const submit=()=>{
    const title = input.trim();
    console.log(title);
    if(!title) return;
    add(title);
    setInput("");
  }

  return (
    <section>
      <div className={styles.colHead}>
        <div className={styles.colTitle}>
          <ListIcon />
          오늘의 루틴
        </div>
        <span className={styles.count}>
          {doneCount}/{total}
        </span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>

      {loading ? (
        <div className={styles.empty}>불러오는 중...</div>
      ) : routines.length === 0 ? (
        <div className={styles.empty}>
          아직 루틴이 없어요.
          <br />
          아래에서 하나 추가해보세요.
        </div>
      ) : (
        <div className={styles.routineList}>
          {routines.map((r) => (
            <div
              key={r.id}
              className={`${styles.routineCard} ${r.done ? styles.routineDone : ""}`}
            >
              <button
                className={`${styles.check} ${r.done ? styles.checkOn : ""}`}
                onClick={() => onToggle(r.id)}
                aria-label={r.done ? "완료 취소" : "완료 표시"}
              >
                {r.done && <span className={styles.checkMark}>✓</span>}
              </button>
              <span
                className={`${styles.routineTitle} ${r.done ? styles.routineTitleDone : ""}`}
              >
                {r.title}
              </span>
              <button className={routineStyles.deleteBtn} onClick={()=> del(r.id)}>
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="새 루틴 추가"
        />
        <button className={styles.smallBtn} onClick={submit}>
          추가
        </button>
      </div>
    </section>
  );
}

function ListIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke="#3ecf8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h2m-2 6h2m-2 6h2M9 6h11M9 12h11M9 18h11" />
    </svg>
  );
}