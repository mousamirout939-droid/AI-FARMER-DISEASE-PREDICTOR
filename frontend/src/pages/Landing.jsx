import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, CloudSun, LineChart, Users, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';

const STATS = [
  { value: '50+', label: 'Crop types supported' },
  { value: '100+', label: 'Disease classes' },
  { value: '<10s', label: 'Average diagnosis time' },
];

const FEATURES = [
  {
    icon: ScanLine,
    title: 'Instant leaf diagnosis',
    desc: 'Photograph a leaf and get the disease, confidence score, and an explainable heatmap of the affected region in seconds.',
  },
  {
    icon: CloudSun,
    title: 'Weather-aware risk',
    desc: 'Live humidity, rainfall, and temperature feed a disease-risk model so you can spray before an outbreak, not after.',
  },
  {
    icon: LineChart,
    title: 'Market & scheme intel',
    desc: 'Mandi prices, MSP, and government subsidy matches, kept in one place alongside your crop history.',
  },
  {
    icon: Users,
    title: 'Ask a real expert',
    desc: 'Escalate any diagnosis to a verified agronomist by chat or video when the stakes are high.',
  },
];

const STEPS = [
  { title: 'Photograph the leaf', desc: 'Any phone camera works — the app checks focus and lighting before you submit.' },
  { title: 'AI reads the tissue', desc: 'A vision model trained on crop pathology scores the disease and marks the affected area.' },
  { title: 'Act on the plan', desc: 'Get organic and chemical treatment options, dosages, and a spray calendar.' },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-field-gradient">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow text-wheat">Field diagnosis, in one photo</span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-sage-50 sm:text-5xl lg:text-6xl">
              Know what's wrong with your crop before it spreads.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-sage-100/85">
              AI Farmer reads leaf photos the way an agronomist would — naming the disease,
              scoring its severity, and handing you a treatment plan, in the time it takes to
              brew a cup of tea.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/predict" className="btn-primary bg-wheat text-forest-dark hover:bg-wheat-dark">
                Diagnose a leaf <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/signup" className="rounded-full border-2 border-sage-50/40 px-6 py-3 font-semibold text-sage-50 transition-colors hover:bg-white/10">
                Create free account
              </Link>
            </div>
            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/15 pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-semibold text-sage-50">{s.value}</div>
                  <div className="text-xs text-sage-100/70">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between text-xs text-sage-100/70">
                <span className="font-mono">SCAN_0417.jpg</span>
                <span className="rounded-full bg-clay/80 px-2 py-0.5 font-mono text-white">Diseased</span>
              </div>
              <div className="mt-3 aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-forest-dark via-forest to-[#3a5f3a]" />
              <div className="mt-4 space-y-2 font-mono text-xs text-sage-100/80">
                <div className="flex justify-between"><span>Crop</span><span>Tomato</span></div>
                <div className="flex justify-between"><span>Predicted class</span><span>Early Blight</span></div>
                <div className="flex justify-between"><span>Confidence</span><span>94.2%</span></div>
                <div className="flex justify-between"><span>Severity</span><span>62 / 100</span></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-wheat px-4 py-3 text-forest-dark shadow-xl sm:block">
              <Leaf className="h-5 w-5" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <span className="eyebrow">What's inside</span>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold text-forest dark:text-sage-50 sm:text-4xl">
          Everything between a photo and a healthy harvest.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/10 text-forest dark:bg-wheat/10 dark:text-wheat">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-forest dark:text-sage-50">{title}</h3>
              <p className="mt-2 text-sm text-forest/65 dark:text-sage-100/65">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sage-100/60 py-20 dark:bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="eyebrow">The process</span>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-forest dark:text-sage-50 sm:text-4xl">
            Three steps, one photo.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="font-display text-5xl font-semibold text-forest/15 dark:text-sage-50/10">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-forest dark:text-sage-50">{step.title}</h3>
                <p className="mt-2 text-sm text-forest/65 dark:text-sage-100/65">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-field-gradient px-8 py-16 text-center">
          <ShieldCheck className="h-10 w-10 text-wheat" />
          <h2 className="max-w-lg text-3xl font-semibold text-sage-50">
            Start protecting your harvest today.
          </h2>
          <p className="max-w-md text-sage-100/80">
            Free to start. No credit card, no field survey — just a camera and a crop.
          </p>
          <Link to="/signup" className="btn-primary bg-wheat text-forest-dark hover:bg-wheat-dark">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
