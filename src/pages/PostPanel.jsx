import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { getPosts } from "../api/postApi";

// 게시판 목록 패널.
// limit 을 주면 메인 대시보드에서 상위 N개만 보여주고,
// 전용 /posts 페이지에서는 limit 없이 전체 목록을 렌더링합니다.
export default function PostPanel({ limit }) {
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async (kw = "") => {
    setLoading(true);
    try {
      const res = await getPosts({ keyword: kw, page: 0, size: limit ?? 10 });
      setPosts(res.data.content); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(keyword);
  }, [keyword]);

  return (
    <section>
      <div className={styles.colHead}>
        <div className={styles.colTitle}>
          <BoardIcon />
          메모
        </div>
        <button
          className={styles.smallBtn}
          onClick={() => navigate("/posts/write")}
        >
          글쓰기
        </button>
      </div>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchPosts(keyword)}
          placeholder="제목으로 검색"
        />
        <button className={styles.searchBtn} onClick={() => fetchPosts(keyword)}>
          검색
        </button>
      </div>

      {loading ? (
        <div className={styles.empty}>불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>게시글이 없습니다.</div>
      ) : (
        <div className={styles.postList}>
          {posts.map((p) => (
            <Link key={p.id} to={`/posts/${p.id}`} className={styles.postRow}>
              <span className={styles.postTitle}>{p.title}</span>
              <span className={styles.postMeta}>
                {p.writer} · 조회 {p.viewCount}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function BoardIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}