import type { ReactNode } from "react";

type LayoutProps = {
  controls: ReactNode;
  canvas: ReactNode;
  inspector: ReactNode;
  stats: ReactNode;
  error?: string | null;
};

export function Layout({ controls, canvas, inspector, stats, error }: LayoutProps) {
  return (
    <main className={`app-shell${error ? " has-error" : ""}`}>
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div>
          <h1>SortFlow</h1>
          <p>Visualiseur d’algorithmes de tri</p>
        </div>
        <div className="rust-badge">Propulsé par Rust</div>
      </header>
      {controls}
      {error && <div className="error-banner">Erreur backend : {error}</div>}
      <section className="workspace-grid">
        <section className="canvas-panel">
          <div className="canvas-toolbar">
            <span>Tableau actif</span>
            <div className="legend" aria-label="Légende">
              <span><i className="normal" />Valeur</span>
              <span><i className="active" />Comparaison / échange</span>
              <span><i className="sorted" />Triée</span>
            </div>
          </div>
          <div className="canvas-stage">{canvas}</div>
        </section>
        {inspector}
      </section>
      {stats}
    </main>
  );
}
