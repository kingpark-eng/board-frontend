// src/pages/PostListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import styles from "./PostListPage.module.css";

function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");      // input에 입력 중인 값
  const [searchTerm, setSearchTerm] = useState(""); // 실제 검색에 쓰는 값
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // page 또는 searchTerm이 바뀔 때마다 목록 다시 불러옴
  useEffect(() => { 
    setLoading(true);
    getPosts({ page, size: 10, keyword: searchTerm })
      .then((res) => { 
        // Spring Page 객체: content(글 배열), totalPages
        console.log(res.data.content);
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error("목록 조회 실패", err))
      .finally(() => setLoading(false), console.log("error"));
  }, [page, searchTerm]);

  // 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);              // 검색하면 1페이지부터
    setSearchTerm(keyword);  // 입력값을 실제 검색어로 확정
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>게시판</h1>

        {isAuthenticated && (
          <button
            className={styles.writeBtn}
            onClick={() => navigate("/posts/new")}
          >
            글쓰기
          </button>
        )}
      </div>

      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목으로 검색"
        />
        <button className={styles.searchBtn} type="submit">
          검색
        </button>
      </form>

      {loading ? (
        <p className={styles.message}>불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className={styles.message}>게시글이 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li
              key={post.id}
              className={styles.item}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <span className={styles.postTitle}>{post.title}</span>
              <span className={styles.meta}> 
                {post.authorNickname} · 조회 {post.viewCount}
              </span>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </button>
          <span className={styles.pageInfo}>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default PostListPage;
