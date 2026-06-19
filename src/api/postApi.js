// src/api/postApi.js
import api from "./axios";

// 게시글 목록 조회 (페이징 + 검색)
export function getPosts({ page = 0, size = 10, keyword = "" }) {
  return api.get("/api/posts", {
    params: { page, size, keyword },
  });
}

// 게시글 상세 조회
export function getPost(id) {
  return api.get(`/api/posts/${id}`);
}

// 게시글 작성
export function createPost(data) {
  return api.post("/api/posts", data);
}

// 게시글 수정
export function updatePost(id, data) {
  return api.put(`/api/posts/${id}`, data);
}

// 게시글 삭제
export function deletePost(id) {
  return api.delete(`/api/posts/${id}`);
}