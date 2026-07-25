export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className="eyebrow">About us</span>
      <h1 className="mt-3 text-3xl font-semibold text-forest dark:text-sage-50 sm:text-4xl">
        Built for the field, not the lab.
      </h1>
      <p className="mt-6 text-forest/70 dark:text-sage-100/70">
        AI Farmer Disease Predictor combines computer vision, weather data, and agricultural
        expertise into one tool a farmer can use with just a smartphone. Our goal is simple: catch
        crop disease early enough that a small intervention beats a lost harvest.
      </p>
      <p className="mt-4 text-forest/70 dark:text-sage-100/70">
        This project is a portfolio-grade demonstration of a full-stack, AI-powered agricultural
        platform — spanning a React frontend, a Node/Express API, and a Python FastAPI computer
        vision service, wired together end-to-end.
      </p>
    </div>
  );
}
