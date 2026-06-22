import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useRef } from "react";

import type { AlgorithmInfo, AnimationStatus } from "../types/sorting";

type AlgorithmCodePanelProps = {
  algorithm?: AlgorithmInfo;
  activeSourceLine: number | null;
  status: AnimationStatus;
};

export function AlgorithmCodePanel({
  algorithm,
  activeSourceLine,
  status,
}: AlgorithmCodePanelProps) {
  const activeLineRef = useRef<HTMLDivElement>(null);
  const scrollRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "playing") return;
    const line = activeLineRef.current;
    const region = scrollRegionRef.current;
    if (!line || !region) return;

    const lineTop = line.offsetTop;
    const lineBottom = lineTop + line.offsetHeight;
    const visibleTop = region.scrollTop;
    const visibleBottom = visibleTop + region.clientHeight;

    if (lineTop < visibleTop) region.scrollTop = lineTop;
    else if (lineBottom > visibleBottom) region.scrollTop = lineBottom - region.clientHeight;
  }, [activeSourceLine, status]);

  if (!algorithm) {
    return (
      <aside className="algorithm-inspector loading" aria-label="Code de l’algorithme">
        <div className="code-loading-line" />
        <div className="code-loading-block" />
      </aside>
    );
  }

  const source = algorithm.source.replace(/\n$/, "");
  const lineStatus =
    activeSourceLine === null
      ? status === "complete"
        ? "Exécution terminée"
        : "En attente d’exécution"
      : `Ligne ${activeSourceLine}`;

  return (
    <aside className="algorithm-inspector" aria-label={`Code de ${algorithm.name}`}>
      <header className="inspector-header">
        <div>
          <span className="inspector-eyebrow">Source Rust exécutée</span>
          <h2>{algorithm.name}</h2>
        </div>
        <span className={`source-line-status ${activeSourceLine ? "active" : ""}`}>
          {lineStatus}
        </span>
      </header>

      <details className="algorithm-description">
        <summary>À propos de l’algorithme</summary>
        <div className="algorithm-description-content">
          <p>{algorithm.description}</p>
          <div className="complexity-grid" aria-label="Complexité de l’algorithme">
            <div><span>Meilleur</span><strong>{algorithm.bestCase}</strong></div>
            <div><span>Moyen</span><strong>{algorithm.averageCase}</strong></div>
            <div><span>Pire</span><strong>{algorithm.worstCase}</strong></div>
          </div>
          <div className="algorithm-properties">
            <span>Stable <strong>{algorithm.stable ? "Oui" : "Non"}</strong></span>
            <span>In-place <strong>{algorithm.inPlace ? "Oui" : "Non"}</strong></span>
            <span>Mémoire <strong>{algorithm.memory}</strong></span>
          </div>
        </div>
      </details>

      <div className="code-file-bar">
        <span className="rust-file-icon">RS</span>
        <span title={algorithm.sourcePath}>{algorithm.sourcePath.split("/").at(-1)}</span>
      </div>

      <div className="code-scroll-region" ref={scrollRegionRef}>
        <Highlight theme={themes.vsDark} code={source} language="rust">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} source-code`} style={{ ...style, background: "transparent" }}>
              {tokens.map((line, index) => {
                const lineNumber = index + 1;
                const isActive = lineNumber === activeSourceLine;
                return (
                  <div
                    {...getLineProps({ line })}
                    className={`source-code-line${isActive ? " active" : ""}`}
                    aria-current={isActive ? "step" : undefined}
                    ref={isActive ? activeLineRef : undefined}
                    key={lineNumber}
                  >
                    <span className="execution-marker" aria-hidden="true">{isActive ? "▶" : ""}</span>
                    <span className="source-line-number">{lineNumber}</span>
                    <span className="source-line-content">
                      {line.map((token, tokenIndex) => (
                        <span {...getTokenProps({ token })} key={tokenIndex} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </aside>
  );
}
