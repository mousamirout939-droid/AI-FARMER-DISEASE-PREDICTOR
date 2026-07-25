import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/endpoints.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const mutation = useMutation({
    mutationFn: () => authApi.forgotPassword(email),
    onSuccess: () => toast.success('Reset link sent, check your email'),
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  });

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-semibold text-forest dark:text-sage-50">Forgot password</h1>
        <p className="mt-1 text-sm text-forest/60 dark:text-sage-100/60">We'll email you a reset link.</p>
        <div className="mt-4">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn-primary mt-4 w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          Send reset link
        </button>
      </div>
    </div>
  );
}
