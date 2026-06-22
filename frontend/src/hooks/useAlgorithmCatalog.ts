import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

import { isAlgorithmInfo } from "../lib/algorithms";
import type { AlgorithmInfo } from "../types/sorting";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function useAlgorithmCatalog() {
  const [algorithms, setAlgorithms] = useState<AlgorithmInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void invoke<unknown[]>("list_algorithms")
      .then((catalog) => {
        if (cancelled) return;
        const uniqueIds = new Set(
          catalog.filter(isAlgorithmInfo).map((algorithm) => algorithm.id),
        );
        if (
          catalog.length === 0 ||
          !catalog.every(isAlgorithmInfo) ||
          uniqueIds.size !== catalog.length
        ) {
          throw new Error("catalogue d’algorithmes invalide reçu depuis Rust");
        }
        setAlgorithms(catalog);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(errorMessage(reason));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { algorithms, error, isLoading };
}
