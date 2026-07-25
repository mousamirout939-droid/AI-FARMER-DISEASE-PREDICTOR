import { ScanLine, CloudSun, LineChart, Users, MessageSquare, FileText, Bell, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: ScanLine, title: 'AI Disease Detection', desc: 'Upload a leaf photo and get crop, disease, confidence, severity, and a GradCAM heatmap.' },
  { icon: CloudSun, title: 'Weather & Risk', desc: 'Live weather with an AI-estimated disease-risk score for your location.' },
  { icon: LineChart, title: 'Market Prices', desc: 'Mandi prices and government scheme matching in one place.' },
  { icon: Users, title: 'Community', desc: 'Discuss issues and share wins with other farmers.' },
  { icon: MessageSquare, title: 'Expert Chat', desc: 'Escalate to a verified agronomist by chat or video appointment.' },
  { icon: FileText, title: 'PDF Reports', desc: 'Every diagnosis can be exported as a shareable PDF report with QR code.' },
  { icon: Bell, title: 'Smart Reminders', desc: 'Spray, medicine, and harvest reminders based on your crop calendar.' },
  { icon: ShieldCheck, title: 'Role-based Access', desc: 'Separate farmer, expert, and admin experiences with JWT-secured APIs.' },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <span className="eyebrow">Everything included</span>
      <h1 className="mt-3 text-3xl font-semibold text-forest dark:text-sage-50 sm:text-4xl">Platform features</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card">
            <Icon className="h-6 w-6 text-forest dark:text-wheat" />
            <h3 className="mt-3 font-semibold text-forest dark:text-sage-50">{title}</h3>
            <p className="mt-1 text-sm text-forest/65 dark:text-sage-100/65">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
