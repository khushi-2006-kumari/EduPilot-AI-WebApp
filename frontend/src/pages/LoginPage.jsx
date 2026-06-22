import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { loginSuccess } from '../store';
import Login from '../features/auth/Login';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector((state) => state.auth.user);

  // If already authenticated, send to onboarding if not completed, else dashboard
  if (user) {
    return <Navigate to={user.onboardingCompleted ? '/dashboard' : '/onboarding'} replace />;
  }

  const handleLoginSuccess = (userData) => {
    dispatch(loginSuccess(userData));
    // If onboarding is not completed, go to onboarding, else dashboard
    if (userData.onboardingCompleted) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  return <Login onLoginSuccess={handleLoginSuccess} initialTab={initialTab} />;
}
