import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: signup, isRegistering } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await signup(data);
      navigate('/dashboard');
    } catch {
      // error toast handled in useAuth
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-sage-50 px-4 py-10 dark:bg-transparent">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-field-gradient text-sage-50">
            <Sprout className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-forest dark:text-sage-50">Create your account</h1>
          <p className="mt-1 text-sm text-forest/60 dark:text-sage-100/60">Start diagnosing crops in minutes.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" className="input" placeholder="Ramesh Kumar" {...register('name', { required: true })} />
            {errors.name && <p className="mt-1 text-xs text-clay">Name is required</p>}
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@farm.com" {...register('email', { required: true })} />
            {errors.email && <p className="mt-1 text-xs text-clay">Email is required</p>}
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="At least 6 characters" {...register('password', { required: true, minLength: 6 })} />
            {errors.password && <p className="mt-1 text-xs text-clay">Password must be at least 6 characters</p>}
          </div>
          <div>
            <label className="label" htmlFor="role">I am a</label>
            <select id="role" className="input" {...register('role')}>
              <option value="farmer">Farmer</option>
              <option value="expert">Agriculture Expert</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isRegistering}>
            {isRegistering ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-forest/70 dark:text-sage-100/70">
          Already have an account? <Link to="/login" className="font-semibold text-forest dark:text-wheat">Log in</Link>
        </p>
      </div>
    </div>
  );
}
