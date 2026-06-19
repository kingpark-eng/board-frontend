// src/pages/PostDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, deletePost } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import styles from "./PostDetailPage.module.css";

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 글 불러오기 (GET) — 서버가 조회수도 올려줌
  useEffect(() => {
    setLoading(true);
    getPost(id)
      .then((res) => setPost(res.data))
      .catch(() => setError("게시글을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  // 삭제 (DELETE)
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deletePost(id);
      navigate("/"); // 삭제 후 목록으로
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <p className={styles.message}>불러오는 중...</p>;
  }

  if (error || !post) {
    return <p className={styles.message}>{error || "게시글이 없습니다."}</p>;
  }

  // 본인 글인지 판단 (작성자 이메일 == 로그인 유저 이메일)
  const isAuthor = user && user.email === post.authorEmail;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span>{post.authorNickname}</span>
          <span>조회 {post.viewCount}</span>
        </div>
      </div>

      <div className={styles.content}>{post.content}</div>

      <div className={styles.actions}>
        <button className={styles.listBtn} onClick={() => navigate("/")}>
          목록
        </button>

        {isAuthor && (
          <div className={styles.authorActions}>
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/posts/${id}/edit`)}
            >
              수정
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetailPage;
