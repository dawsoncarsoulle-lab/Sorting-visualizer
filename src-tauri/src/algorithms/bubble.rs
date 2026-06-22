use crate::model::{SortResult, SortStats, SortStep};

pub fn bubble_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();
    let n = values.len();

    for sorted_count in 0..n {
        for j in 0..n - sorted_count - 1 {
            steps.push(SortStep::Compare { i: j, j: j + 1 });
            stats.comparisons += 1;

            if values[j] > values[j + 1] {
                values.swap(j, j + 1);
                steps.push(SortStep::Swap { i: j, j: j + 1 });
                stats.swaps += 1;
            }
        }

        steps.push(SortStep::MarkSorted {
            i: n - sorted_count - 1,
        });
    }

    SortResult { steps, stats }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::algorithms::replay_steps;

    #[test]
    fn sorts_an_unsorted_list() {
        let input = vec![5, 3, 1, 4, 2];
        let result = bubble_sort(input.clone());

        assert_eq!(replay_steps(input, &result.steps), vec![1, 2, 3, 4, 5]);
        assert_eq!(result.stats.comparisons, 10);
        assert_eq!(result.stats.swaps, 7);
    }

    #[test]
    fn handles_empty_and_single_value_lists() {
        let empty = bubble_sort(vec![]);
        assert!(empty.steps.is_empty());
        assert_eq!(replay_steps(vec![], &empty.steps), Vec::<u32>::new());

        let single = bubble_sort(vec![42]);
        assert_eq!(replay_steps(vec![42], &single.steps), vec![42]);
        assert_eq!(single.steps, vec![SortStep::MarkSorted { i: 0 }]);
    }

    #[test]
    fn sorts_duplicates_and_reversed_values() {
        for input in [vec![3, 1, 3, 2, 1], vec![5, 4, 3, 2, 1]] {
            let mut expected = input.clone();
            expected.sort();
            let result = bubble_sort(input.clone());
            assert_eq!(replay_steps(input, &result.steps), expected);
        }
    }
}
