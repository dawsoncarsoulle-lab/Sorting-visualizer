use crate::model::{SortResult, SortStats, SortStep};

use super::{record_compare, record_swap};

pub fn bubble_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();
    let n = values.len();

    for sorted_count in 0..n {
        for j in 0..n - sorted_count - 1 {
            record_compare(&mut steps, &mut stats, j, j + 1, line!());

            if values[j] > values[j + 1] {
                record_swap(&mut values, &mut steps, &mut stats, j, j + 1, line!());
            }
        }

        steps.push(SortStep::MarkSorted {
            i: n - sorted_count - 1,
            source_line: line!(),
        });
    }

    SortResult { steps, stats }
}
