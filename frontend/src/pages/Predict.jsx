import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UploadCloud, Loader2, AlertTriangle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { predictionApi } from '../api/endpoints.js';
import Badge from '../components/ui/Badge.jsx';

const severityTone = (score) => (score >= 60 ? 'high' : score >= 30 ? 'moderate' : 'low');

export default function Predict() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const mutation = useMutation({
    mutationFn: (formData) => predictionApi.create(formData),
    onSuccess: ({ data }) => {
      setResult(data.data);
      toast.success('Diagnosis complete');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Prediction failed. Is the AI service running?'),
  });

  const onFileChange = useCallback((selected) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    onFileChange(e.dataTransfer.files?.[0]);
  };

  const submit = () => {
    if (!file) return toast.error('Please select an image first');
    const formData = new FormData();
    formData.append('image', file);
    mutation.mutate(formData);
  };

  const downloadReport = async () => {
    if (!result?._id) return;
    try {
      const { data } = await predictionApi.report(result._id);
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${result._id}.pdf`;
      a.click();
    } catch {
      toast.error('Could not generate report');
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Detect a disease</h1>
      <p className="mt-1 text-sm text-forest/60 dark:text-sage-100/60">
        Upload a clear, well-lit photo of a single leaf for the most accurate result.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="card flex h-72 flex-col items-center justify-center border-2 border-dashed text-center"
          >
            {preview ? (
              <img src={preview} alt="Selected leaf" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-forest/40 dark:text-sage-100/40" />
                <p className="mt-3 text-sm text-forest/60 dark:text-sage-100/60">Drag & drop an image, or</p>
                <label className="btn-secondary mt-3 cursor-pointer text-sm">
                  Browse files
                  <input type="file" accept="image/*" hidden onChange={(e) => onFileChange(e.target.files?.[0])} />
                </label>
              </>
            )}
          </div>
          <button onClick={submit} disabled={mutation.isPending || !file} className="btn-primary mt-4 w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
              </>
            ) : (
              'Run diagnosis'
            )}
          </button>
        </div>

        <div>
          {!result && !mutation.isPending && (
            <div className="card flex h-full items-center justify-center text-center text-sm text-forest/50 dark:text-sage-100/50">
              Results will appear here once you run a diagnosis.
            </div>
          )}

          {mutation.isPending && (
            <div className="card flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-forest/60 dark:text-sage-100/60">
              <Loader2 className="h-6 w-6 animate-spin text-forest dark:text-wheat" />
              Running inference on the AI service…
            </div>
          )}

          {result && (
            <div className="card space-y-4">
              {result.disease?.isHealthy ? (
                <Badge tone="low">Healthy</Badge>
              ) : (
                <Badge tone={severityTone(result.severityScore)}>Diseased</Badge>
              )}

              <div>
                <h2 className="text-lg font-semibold text-forest dark:text-sage-50">
                  {result.disease?.name || result.predictedClass}
                </h2>
                <p className="text-sm text-forest/60 dark:text-sage-100/60">{result.crop}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <div className="text-forest/50 dark:text-sage-100/50">Confidence</div>
                  <div className="text-base font-semibold text-forest dark:text-sage-50">{(result.confidence * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-forest/50 dark:text-sage-100/50">Severity</div>
                  <div className="text-base font-semibold text-forest dark:text-sage-50">{result.severityScore}/100</div>
                </div>
              </div>

              {result.disease?.symptoms?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-forest dark:text-sage-50">Symptoms</h3>
                  <ul className="mt-1 list-inside list-disc text-sm text-forest/70 dark:text-sage-100/70">
                    {result.disease.symptoms.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}

              {result.disease?.organicTreatment?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-forest dark:text-sage-50">Organic treatment</h3>
                  <ul className="mt-1 list-inside list-disc text-sm text-forest/70 dark:text-sage-100/70">
                    {result.disease.organicTreatment.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}

              <button onClick={downloadReport} className="btn-secondary w-full text-sm">
                <Download className="h-4 w-4" /> Download PDF report
              </button>

              <div className="flex items-start gap-2 rounded-xl bg-wheat/10 p-3 text-xs text-forest/70 dark:text-sage-100/70">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-wheat-dark" />
                AI-assisted diagnosis. For high-value crops or uncertain cases, confirm with an
                agriculture expert before applying chemical treatment.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
