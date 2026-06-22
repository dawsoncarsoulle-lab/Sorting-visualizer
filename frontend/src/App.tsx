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
    algorithm,
    progress,
    setSize,
    setSpeed,
    setAlgorithm,
    shuffle,
    reset,
    play,
    pause,
    step,
  } = useSortAnimation();
  const selectedAlgorithm = catalog.algorithms.find((entry) => entry.id === algorithm);
  const error = catalog.error ?? state.error;
  const isLoading = catalog.isLoading || state.status === "loading";

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
          onShuffle={shuffle}
          onReset={reset}
          onPlay={play}
          onPause={pause}
          onStep={step}
          onSizeChange={setSize}
          onSpeedChange={setSpeed}
          onAlgorithmChange={setAlgorithm}
        />
      }
      canvas={
        <SortCanvas
          values={state.values}
          highlighted={state.highlighted}
          sortedIndices={state.sortedIndices}
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
        />
      }
    />
  );
}
