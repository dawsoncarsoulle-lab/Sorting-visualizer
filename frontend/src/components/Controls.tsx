type ControlsProps = {
  isPlaying: boolean;
  isLoading: boolean;
  size: number;
  speed: number;
  onShuffle: () => void;
  onReset: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onSizeChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
};

export function Controls({
  isPlaying,
  isLoading,
  size,
  speed,
  onShuffle,
  onReset,
  onPlay,
  onPause,
  onStep,
  onSizeChange,
  onSpeedChange,
}: ControlsProps) {
  return (
    <section className="control-panel" aria-label="Contrôles du tri">
      <div className="control-group algorithm-control">
        <span className="control-label">Algorithme</span>
        <div className="select-display">
          <span className="algorithm-dot" />
          Bubble Sort
          <span className="phase-pill">MVP</span>
        </div>
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
        <button className="button secondary" disabled={isLoading || isPlaying} onClick={onShuffle}>
          Mélanger
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

