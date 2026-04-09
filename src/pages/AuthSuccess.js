import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { navigate('/login?error=missing_token', { replace: true }); return; }

    localStorage.setItem('token', token);

    loginWithToken(token)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => navigate('/login?error=oauth_failed', { replace: true }));
  }, [navigate]); 

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
      <p style={{ fontFamily:'monospace', color:'#888' }}>Signing you in…</p>
    </div>
  );
}