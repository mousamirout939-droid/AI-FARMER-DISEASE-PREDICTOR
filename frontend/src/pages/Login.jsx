import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch {
      // error toast handled in useAuth
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-sage-50 px-4 dark:bg-transparent">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-field-gradient text-sage-50">
            <Sprout className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-forest dark:text-sage-50">Welcome back</h1>
          <p className="mt-1 text-sm text-forest/60 dark:text-sage-100/60">Log in to check on your crops.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@farm.com" {...register('email', { required: true })} />
            {errors.email && <p className="mt-1 text-xs text-clay">Email is required</p>}
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="••••••••" {...register('password', { required: true })} />
            {errors.password && <p className="mt-1 text-xs text-clay">Password is required</p>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-forest/70 hover:text-forest dark:text-sage-100/70">Forgot password?</Link>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in…' : 'Log in'}
          </button>
          <p className="text-center text-xs text-forest/50 dark:text-sage-100/50">
            Demo logins: farmer@aifarmer.app / Farmer@12345 · admin@aifarmer.app / Admin@12345
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-forest/70 dark:text-sage-100/70">
          New here? <Link to="/signup" className="font-semibold text-forest dark:text-wheat">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
