import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth(); 
  if (loading) return <div>로딩 중...</div>;   // 확인 끝날 때까지 대기

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;