import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PostListPage from "./pages/PostPanel";
import RegisterPage from "./pages/RegisterPage";
import PostFormPage from "./pages/PostFormPage";
import PostDetailPage from "./pages/PostDetailPage";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import RoutinePanel from "./pages/RoutinePanel";
import RoutineHistory from "./pages/RoutineHistory";

// element에 컴포넌트를 넘길때에는 태그형태로 넘겨줘야함.
function App() {
  return (
    <>
      {/* <Header /> */}

      <Layout>
        <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/posts"          element={<PostListPage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/posts/new"      element={<PostFormPage />} />
            <Route path="/posts/:id"      element={<PostDetailPage />} />
            <Route path="/posts/:id/edit"      element={<PostFormPage />} />
            <Route path="/routines" element={<RoutinePanel/>} />
            <Route path="/history" element={<RoutineHistory />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
