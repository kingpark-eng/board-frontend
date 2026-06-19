// src/pages/PostFormPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, createPost, updatePost } from "../api/postApi";
import styles from "./PostFormPage.module.css";

function PostFormPage() {
  const { id } = useParams();      // URL의 :id (수정 모드면 값 있음, 작성 모드면 undefined)
  const isEdit = Boolean(id);      // id가 있으면 수정 모드

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 수정 모드일 때만 기존 글 불러와서 폼 채우기
  useEffect(() => {
    if (isEdit) {
      getPost(id)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch(() => setError("게시글을 불러오지 못했습니다."));
    }
  }, [id, isEdit]);

  //서버 호출을 하기때문에 async 사용, 함수안에 await
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updatePost(id, { title, content });
        navigate(`/posts/${id}`);        // 수정 후 그 글 상세로
      } else {
        const res = await createPost({ title, content });
        navigate(`/posts/${res.data.id}`); // 작성 후 새 글 상세로
      }
    } catch (err) {
      const message =
        err.response?.data?.message ?? "저장에 실패했습니다. 다시 시도해주세요.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{isEdit ? "글 수정" : "글쓰기"}</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.titleInput}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />

        <textarea
          className={styles.contentInput}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={14}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "저장 중..." : isEdit ? "수정 완료" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostFormPage;