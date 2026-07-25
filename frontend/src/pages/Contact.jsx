import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    toast.success("Thanks! We'll get back to you soon.");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <span className="eyebrow">Get in touch</span>
      <h1 className="mt-3 text-3xl font-semibold text-forest dark:text-sage-50 sm:text-4xl">Contact us</h1>
      <form onSubmit={submit} className="card mt-8 space-y-4">
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea className="input" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        </div>
        <button type="submit" className="btn-primary w-full">Send message</button>
      </form>
    </div>
  );
}
