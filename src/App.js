import Header from "./components/common/Header";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PostListPage from "./pages/PostListPage";
import RegisterPage from "./pages/RegisterPage";
import PostFormPage from "./pages/PostFormPage";
import PostDetailPage from "./pages/PostDetailPage";


// element에 컴포넌트를 넘길때에는 태그형태로 넘겨줘야함.
function App() {
  return (
    <>
      <Header />

      <Routes>
          <Route path="/"          element={<PostListPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/posts/new"      element={<PostFormPage />} />
          <Route path="/posts/:id"      element={<PostDetailPage />} />
          <Route path="/posts/:id/edit"      element={<PostFormPage />} />
      </Routes>
    </>
  );
}

export default App;
