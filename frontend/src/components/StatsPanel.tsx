import type { AnimationStatus, SortStats } from "../types/sorting";

type StatsPanelProps = {
  stats: SortStats;
  currentStep: number;
  totalSteps: number;
  progress: number;
  status: AnimationStatus;
};

const statusLabels: Record<AnimationStatus, string> = {
  idle: "Prêt",
  loading: "Calcul Rust",
  ready: "En pause",
  playing: "En cours",
  complete: "Terminé",
};

export function StatsPanel({ stats, currentStep, totalSteps, progress, status }: StatsPanelProps) {
  return (
    <section className="stats-panel" aria-label="Statistiques du tri">
      <div className="status-block">
        <span className={`status-indicator ${status}`} />
        <div>
          <span className="stat-label">État</span>
          <strong>{statusLabels[status]}</strong>
        </div>
      </div>
      <div className="stat-item">
        <span className="stat-label">Comparaisons</span>
        <strong>{stats.comparisons.toLocaleString("fr-FR")}</strong>
      </div>
      <div className="stat-item">
        <span className="stat-label">Échanges</span>
        <strong>{stats.swaps.toLocaleString("fr-FR")}</strong>
      </div>
      <div className="stat-item">
        <span className="stat-label">Étape</span>
        <strong>
          {currentStep.toLocaleString("fr-FR")} / {totalSteps.toLocaleString("fr-FR")}
        </strong>
      </div>
      <div className="progress-block">
        <div className="progress-copy">
          <span className="stat-label">Progression</span>
          <strong>{Math.round(progress)}%</strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-value" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}

