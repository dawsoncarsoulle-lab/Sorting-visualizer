import { useEffect } from "react";

import { AlgorithmCodePanel } from "./components/AlgorithmCodePanel";
import { Controls } from "./components/Controls";
import { Layout } from "./components/Layout";
import { SortCanvas } from "./components/SortCanvas";
import { StatsPanel } from "./components/StatsPanel";
import { useAlgorithmCatalog } from "./hooks/useAlgorithmCatalog";
import { useSortAnimation } from "./hooks/useSortAnimation";

export default function App() {
  const catalog = useAlgorithmCatalog();
  const {
    state,
    size,
    speed,
    pattern,
    mode,
    algorithm,
    progress,
    setSize,
    setSpeed,
    setPattern,
    setMode,
    setAlgorithm,
    shuffle,
    reset,
    play,
    pause,
    step,
  } = useSortAnimation();

  useEffect(() => {
    if (!algorithm && catalog.algorithms[0]) setAlgorithm(catalog.algorithms[0].id);
  }, [algorithm, catalog.algorithms, setAlgorithm]);

  const selectedAlgorithm = catalog.algorithms.find((entry) => entry.id === algorithm);
  const error = catalog.error ?? state.error;
  const isLoading = catalog.isLoading || !algorithm || state.status === "loading";

  return (
    <Layout
      error={error}
      controls={
        <Controls
          isPlaying={state.status === "playing"}
          isLoading={isLoading}
          size={size}
          speed={speed}
          algorithm={algorithm}
          algorithms={catalog.algorithms}
          pattern={pattern}
          mode={mode}
          onShuffle={shuffle}
          onReset={reset}
          onPlay={play}
          onPause={pause}
          onStep={step}
          onSizeChange={setSize}
          onSpeedChange={setSpeed}
          onAlgorithmChange={setAlgorithm}
          onPatternChange={setPattern}
          onModeChange={setMode}
        />
      }
      canvas={
        <SortCanvas
          values={state.values}
          highlighted={state.highlighted}
          sortedIndices={state.sortedIndices}
          operation={state.activeOperation?.kind ?? null}
        />
      }
      inspector={
        <AlgorithmCodePanel
          algorithm={selectedAlgorithm}
          activeSourceLine={state.activeSourceLine}
          status={state.status}
        />
      }
      stats={
        <StatsPanel
          stats={state.liveStats}
          currentStep={state.currentStep}
          totalSteps={state.steps.length}
          progress={progress}
          status={state.status}
          currentOperation={state.activeOperation?.description ?? null}
        />
      }
    />
  );
}
