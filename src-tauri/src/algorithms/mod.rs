mod bubble;
mod cocktail;
mod comb;
mod gnome;
mod heap;
mod insertion;
mod merge;
mod quick;
mod selection;
mod shell;

use crate::model::{AlgorithmInfo, SortResult, SortStats, SortStep};

type SortFunction = fn(Vec<u32>) -> SortResult;

#[derive(Clone, Copy)]
struct AlgorithmEntry {
    info: AlgorithmInfo,
    sort: SortFunction,
}

const ALGORITHMS: [AlgorithmEntry; 10] = [
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "bubble",
            name: "Bubble Sort",
            family: "Simple",
            description: "Bubble Sort parcourt plusieurs fois le tableau, compare chaque paire de voisins et les échange lorsqu'ils sont dans le mauvais ordre. Il est très lisible, mais devient lent lorsque la taille augmente.",
            source_path: "src-tauri/src/algorithms/bubble.rs",
            source: include_str!("bubble.rs"),
            best_case: "O(n)",
            average_case: "O(n²)",
            worst_case: "O(n²)",
            stable: true,
            in_place: true,
            memory: "O(1)",
        },
        sort: bubble::bubble_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "selection",
            name: "Selection Sort",
            family: "Simple",
            description: "Selection Sort recherche le plus petit élément de la partie non triée, puis le place à sa position définitive. Son nombre d'échanges reste faible, mais il effectue toujours beaucoup de comparaisons.",
            source_path: "src-tauri/src/algorithms/selection.rs",
            source: include_str!("selection.rs"),
            best_case: "O(n²)",
            average_case: "O(n²)",
            worst_case: "O(n²)",
            stable: false,
            in_place: true,
            memory: "O(1)",
        },
        sort: selection::selection_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "insertion",
            name: "Insertion Sort",
            family: "Simple",
            description: "Insertion Sort construit une zone triée en insérant chaque nouvelle valeur à sa place. Il est particulièrement efficace sur les petits tableaux ou les données presque triées.",
            source_path: "src-tauri/src/algorithms/insertion.rs",
            source: include_str!("insertion.rs"),
            best_case: "O(n)",
            average_case: "O(n²)",
            worst_case: "O(n²)",
            stable: true,
            in_place: true,
            memory: "O(1)",
        },
        sort: insertion::insertion_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "cocktail",
            name: "Cocktail Shaker Sort",
            family: "Simple",
            description: "Cocktail Shaker Sort est une variante bidirectionnelle de Bubble Sort. Chaque passage déplace les grandes valeurs vers la droite, puis les petites vers la gauche.",
            source_path: "src-tauri/src/algorithms/cocktail.rs",
            source: include_str!("cocktail.rs"),
            best_case: "O(n)",
            average_case: "O(n²)",
            worst_case: "O(n²)",
            stable: true,
            in_place: true,
            memory: "O(1)",
        },
        sort: cocktail::cocktail_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "comb",
            name: "Comb Sort",
            family: "Efficient",
            description: "Comb Sort améliore Bubble Sort en comparant d'abord des éléments éloignés. L'écart diminue progressivement jusqu'à un passage final entre voisins.",
            source_path: "src-tauri/src/algorithms/comb.rs",
            source: include_str!("comb.rs"),
            best_case: "O(n log n)",
            average_case: "O(n²)",
            worst_case: "O(n²)",
            stable: false,
            in_place: true,
            memory: "O(1)",
        },
        sort: comb::comb_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "shell",
            name: "Shell Sort",
            family: "Efficient",
            description: "Shell Sort applique des insertions sur des sous-séquences espacées, puis réduit l'écart. Les déplacements lointains accélèrent nettement le tri par insertion classique.",
            source_path: "src-tauri/src/algorithms/shell.rs",
            source: include_str!("shell.rs"),
            best_case: "O(n log n)",
            average_case: "≈ O(n^1.5)",
            worst_case: "O(n²)",
            stable: false,
            in_place: true,
            memory: "O(1)",
        },
        sort: shell::shell_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "quick",
            name: "Quick Sort",
            family: "Efficient",
            description: "Quick Sort choisit un pivot, partitionne les valeurs de part et d'autre, puis trie récursivement les deux partitions. Il est généralement très rapide, mais dépend du choix du pivot.",
            source_path: "src-tauri/src/algorithms/quick.rs",
            source: include_str!("quick.rs"),
            best_case: "O(n log n)",
            average_case: "O(n log n)",
            worst_case: "O(n²)",
            stable: false,
            in_place: true,
            memory: "O(log n)",
        },
        sort: quick::quick_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "merge",
            name: "Merge Sort",
            family: "Efficient",
            description: "Merge Sort divise récursivement le tableau, trie chaque moitié, puis les fusionne. Ses performances sont régulières et ses étapes écrivent des valeurs plutôt que de les échanger.",
            source_path: "src-tauri/src/algorithms/merge.rs",
            source: include_str!("merge.rs"),
            best_case: "O(n log n)",
            average_case: "O(n log n)",
            worst_case: "O(n log n)",
            stable: true,
            in_place: false,
            memory: "O(n)",
        },
        sort: merge::merge_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "heap",
            name: "Heap Sort",
            family: "Efficient",
            description: "Heap Sort organise les valeurs dans un tas maximal, extrait successivement sa racine et restaure le tas. Il garantit une complexité logarithmique par extraction sans mémoire auxiliaire importante.",
            source_path: "src-tauri/src/algorithms/heap.rs",
            source: include_str!("heap.rs"),
            best_case: "O(n log n)",
            average_case: "O(n log n)",
            worst_case: "O(n log n)",
            stable: false,
            in_place: true,
            memory: "O(1)",
        },
        sort: heap::heap_sort,
    },
    AlgorithmEntry {
        info: AlgorithmInfo {
            id: "gnome",
            name: "Gnome Sort",
            family: "Simple",
            description: "Gnome Sort avance tant que les voisins sont ordonnés et recule après chaque échange. Son comportement est intuitif et proche du tri par insertion, mais sa complexité reste quadratique.",
            source_path: "src-tauri/src/algorithms/gnome.rs",
            source: include_str!("gnome.rs"),
            best_case: "O(n)",
            average_case: "O(n²)",
            worst_case: "O(n²)",
            stable: true,
            in_place: true,
            memory: "O(1)",
        },
        sort: gnome::gnome_sort,
    },
];

pub fn run_algorithm(id: &str, values: Vec<u32>) -> Option<SortResult> {
    ALGORITHMS
        .iter()
        .find(|entry| entry.info.id == id)
        .map(|entry| (entry.sort)(values))
}

pub fn list_algorithms() -> Vec<AlgorithmInfo> {
    ALGORITHMS.iter().map(|entry| entry.info).collect()
}

fn record_compare(
    steps: &mut Vec<SortStep>,
    stats: &mut SortStats,
    i: usize,
    j: usize,
    source_line: u32,
) {
    steps.push(SortStep::Compare { i, j, source_line });
    stats.comparisons += 1;
}

fn record_swap(
    values: &mut [u32],
    steps: &mut Vec<SortStep>,
    stats: &mut SortStats,
    i: usize,
    j: usize,
    source_line: u32,
) {
    if i == j {
        return;
    }

    values.swap(i, j);
    steps.push(SortStep::Swap { i, j, source_line });
    stats.swaps += 1;
}

fn record_write(
    values: &mut [u32],
    steps: &mut Vec<SortStep>,
    stats: &mut SortStats,
    local_index: usize,
    step_index: usize,
    value: u32,
    source_line: u32,
) {
    values[local_index] = value;
    steps.push(SortStep::Set {
        i: step_index,
        value,
        source_line,
    });
    stats.writes += 1;
}

fn mark_all_sorted(steps: &mut Vec<SortStep>, len: usize, source_line: u32) {
    steps.extend((0..len).map(|i| SortStep::MarkSorted { i, source_line }));
}

#[cfg(test)]
pub(crate) fn replay_steps(mut values: Vec<u32>, steps: &[crate::model::SortStep]) -> Vec<u32> {
    use crate::model::SortStep;

    for step in steps {
        match step {
            SortStep::Swap { i, j, .. } => values.swap(*i, *j),
            SortStep::Set { i, value, .. } => values[*i] = *value,
            SortStep::Compare { .. } | SortStep::MarkSorted { .. } => {}
        }
    }

    values
}

#[cfg(test)]
mod tests {
    use super::*;

    const CASES: &[&[u32]] = &[
        &[],
        &[42],
        &[1, 2, 3, 4, 5],
        &[5, 4, 3, 2, 1],
        &[3, 1, 3, 2, 1],
        &[9, 2, 7, 4, 6, 1, 8, 5, 3],
    ];

    #[test]
    fn every_algorithm_replays_to_a_sorted_list() {
        for entry in ALGORITHMS {
            let id = entry.info.id;
            for case in CASES {
                let input = case.to_vec();
                let mut expected = input.clone();
                expected.sort_unstable();
                let result = run_algorithm(id, input.clone()).expect("registered algorithm");

                assert_eq!(
                    replay_steps(input, &result.steps),
                    expected,
                    "algorithm {id} failed"
                );
            }
        }
    }

    #[test]
    fn every_algorithm_emits_valid_indices_and_consistent_stats() {
        let input = vec![7, 2, 5, 1, 6, 3, 4];

        for entry in ALGORITHMS {
            let id = entry.info.id;
            let result = run_algorithm(id, input.clone()).expect("registered algorithm");
            let mut stats = SortStats::default();

            for step in &result.steps {
                match step {
                    SortStep::Compare { i, j, .. } | SortStep::Swap { i, j, .. } => {
                        assert!(
                            *i < input.len() && *j < input.len(),
                            "invalid index from {id}"
                        );
                        if matches!(step, SortStep::Compare { .. }) {
                            stats.comparisons += 1;
                        } else {
                            stats.swaps += 1;
                        }
                    }
                    SortStep::Set { i, .. } => {
                        assert!(*i < input.len(), "invalid index from {id}");
                        stats.writes += 1;
                    }
                    SortStep::MarkSorted { i, .. } => {
                        assert!(*i < input.len(), "invalid index from {id}");
                    }
                }
            }

            assert_eq!(result.stats, stats, "inconsistent stats from {id}");
        }
    }

    #[test]
    fn every_algorithm_sorts_deterministic_generated_cases() {
        let mut seed = 0x5eed_u32;

        for len in 0..=32 {
            let input: Vec<u32> = (0..len)
                .map(|_| {
                    seed = seed.wrapping_mul(1_664_525).wrapping_add(1_013_904_223);
                    seed % 11
                })
                .collect();
            let mut expected = input.clone();
            expected.sort_unstable();

            for entry in ALGORITHMS {
                let id = entry.info.id;
                let result = run_algorithm(id, input.clone()).expect("registered algorithm");
                assert_eq!(
                    replay_steps(input.clone(), &result.steps),
                    expected,
                    "algorithm {id} failed for len {len}"
                );
            }
        }
    }

    #[test]
    fn merge_sort_uses_global_indices_for_nested_writes() {
        let result = run_algorithm("merge", vec![4, 3, 2, 1]).expect("merge is registered");
        let first_nested_writes: Vec<usize> = result
            .steps
            .iter()
            .filter_map(|step| match step {
                SortStep::Set { i, .. } => Some(*i),
                _ => None,
            })
            .take(4)
            .collect();

        assert_eq!(first_nested_writes, vec![0, 1, 2, 3]);
    }

    #[test]
    fn every_step_points_to_a_line_in_the_exact_source_file() {
        let input = vec![4, 1, 3, 2];

        for entry in ALGORITHMS {
            let result = (entry.sort)(input.clone());
            let source_line_count = entry.info.source.lines().count() as u32;

            assert!(!entry.info.description.is_empty());
            assert!(!entry.info.source.is_empty());
            for step in result.steps {
                assert!(
                    (1..=source_line_count).contains(&step.source_line()),
                    "{} emitted invalid source line {}",
                    entry.info.id,
                    step.source_line()
                );
            }
        }
    }

    #[test]
    fn algorithm_catalog_contains_ten_unique_entries() {
        let catalog = list_algorithms();
        let mut ids: Vec<&str> = catalog.iter().map(|info| info.id).collect();
        ids.sort_unstable();
        ids.dedup();

        assert_eq!(catalog.len(), 10);
        assert_eq!(ids.len(), catalog.len());
        assert!(catalog.iter().all(|info| {
            !info.best_case.is_empty()
                && !info.average_case.is_empty()
                && !info.worst_case.is_empty()
                && !info.memory.is_empty()
        }));
    }

    #[test]
    fn bubble_sort_uses_its_linear_best_case() {
        let result = run_algorithm("bubble", (1..=20).collect()).expect("bubble is registered");
        assert_eq!(result.stats.comparisons, 19);
        assert_eq!(result.stats.swaps, 0);
    }
}
