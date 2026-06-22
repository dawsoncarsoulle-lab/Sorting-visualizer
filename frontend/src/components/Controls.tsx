import type { AlgorithmId, AlgorithmInfo } from "../types/sorting";
import type { ValuePattern } from "../lib/generateValues";
import type { AnimationMode } from "../types/sorting";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { PatternSelector } from "./PatternSelector";

type ControlsProps = {
  isPlaying: boolean;
  isLoading: boolean;
  size: number;
  speed: number;
  algorithm: AlgorithmId;
  algorithms: readonly AlgorithmInfo[];
  pattern: ValuePattern;
  mode: AnimationMode;
  onShuffle: () => void;
  onReset: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onSizeChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onAlgorithmChange: (algorithm: AlgorithmId) => void;
  onPatternChange: (pattern: ValuePattern) => void;
  onModeChange: (mode: AnimationMode) => void;
};

export function Controls({
  isPlaying,
  isLoading,
  size,
  speed,
  algorithm,
  algorithms,
  pattern,
  mode,
  onShuffle,
  onReset,
  onPlay,
  onPause,
  onStep,
  onSizeChange,
  onSpeedChange,
  onAlgorithmChange,
  onPatternChange,
  onModeChange,
}: ControlsProps) {
  return (
    <section className="control-panel" aria-label="Contrôles du tri">
      <div className="control-group algorithm-control">
        <span className="control-label" id="algorithm-label">Algorithme</span>
        <AlgorithmSelector
          algorithms={algorithms}
          value={algorithm}
          disabled={isLoading || isPlaying}
          onChange={onAlgorithmChange}
        />
      </div>

      <div className="control-group pattern-control">
        <span className="control-label" id="pattern-label">Distribution</span>
        <PatternSelector
          value={pattern}
          disabled={isLoading || isPlaying}
          onChange={onPatternChange}
        />
      </div>

      <label className="control-group" htmlFor="size">
        <span className="control-label-row">
          <span className="control-label">Taille</span>
          <output>{size}</output>
        </span>
        <input
          id="size"
          type="range"
          min="10"
          max="200"
          value={size}
          disabled={isLoading || isPlaying}
          onChange={(event) => onSizeChange(Number(event.target.value))}
        />
      </label>

      <label className="control-group" htmlFor="speed">
        <span className="control-label-row">
          <span className="control-label">Vitesse</span>
          <output>{speed}%</output>
        </span>
        <input
          id="speed"
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
        />
      </label>

      <div className="button-row">
        <div className="mode-toggle" aria-label="Mode d’animation">
          <button
            type="button"
            className={mode === "educational" ? "active" : ""}
            aria-pressed={mode === "educational"}
            disabled={isLoading || isPlaying}
            onClick={() => onModeChange("educational")}
          >
            Pédagogique
          </button>
          <button
            type="button"
            className={mode === "fast" ? "active" : ""}
            aria-pressed={mode === "fast"}
            disabled={isLoading || isPlaying}
            onClick={() => onModeChange("fast")}
          >
            Rapide
          </button>
        </div>
        <button className="button secondary" disabled={isLoading || isPlaying} onClick={onShuffle}>
          Générer
        </button>
        <button className="button secondary" disabled={isLoading || isPlaying} onClick={onReset}>
          Réinitialiser
        </button>
        {isPlaying ? (
          <button className="button primary" onClick={onPause}>
            Pause
          </button>
        ) : (
          <button className="button primary" disabled={isLoading} onClick={onPlay}>
            {isLoading ? "Préparation…" : "Lecture"}
          </button>
        )}
        <button className="button icon-button" disabled={isLoading || isPlaying} onClick={onStep}>
          Pas à pas
        </button>
      </div>
    </section>
  );
}
