import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/endpoints.js';
import { setCredentials, logout as logoutAction } from '../store/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      dispatch(setCredentials(data.data));
      toast.success('Welcome back!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data }) => {
      dispatch(setCredentials(data.data));
      toast.success('Account created successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    }
    dispatch(logoutAction());
    toast.success('Logged out');
  };

  return {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken && user),
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
};
