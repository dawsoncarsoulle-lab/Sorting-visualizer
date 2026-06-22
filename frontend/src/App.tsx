import { Controls } from "./components/Controls";
import { Layout } from "./components/Layout";
import { SortCanvas } from "./components/SortCanvas";
import { StatsPanel } from "./components/StatsPanel";
import { useSortAnimation } from "./hooks/useSortAnimation";

export default function App() {
  const {
    state,
    size,
    speed,
    progress,
    setSize,
    setSpeed,
    shuffle,
    reset,
    play,
    pause,
    step,
  } = useSortAnimation();

  return (
    <Layout
      error={state.error}
      controls={
        <Controls
          isPlaying={state.status === "playing"}
          isLoading={state.status === "loading"}
          size={size}
          speed={speed}
          onShuffle={shuffle}
          onReset={reset}
          onPlay={play}
          onPause={pause}
          onStep={step}
          onSizeChange={setSize}
          onSpeedChange={setSpeed}
        />
      }
      canvas={
        <SortCanvas
          values={state.values}
          highlighted={state.highlighted}
          sortedIndices={state.sortedIndices}
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

