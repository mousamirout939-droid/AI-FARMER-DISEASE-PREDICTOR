import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/endpoints.js';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => authApi.resetPassword({ token, password }),
    onSuccess: () => {
      toast.success('Password reset. Please log in.');
      navigate('/login');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Reset failed'),
  });

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-semibold text-forest dark:text-sage-50">Reset password</h1>
        <div className="mt-4">
          <label className="label">New password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn-primary mt-4 w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          Reset password
        </button>
      </div>
    </div>
  );
}
