use crate::model::{SortResult, SortStats, SortStep};

use super::{record_compare, record_swap};

pub fn selection_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();

    for start in 0..values.len() {
        let mut minimum = start;
        for candidate in start + 1..values.len() {
            record_compare(&mut steps, &mut stats, minimum, candidate, line!());
            if values[candidate] < values[minimum] {
                minimum = candidate;
            }
        }
        record_swap(&mut values, &mut steps, &mut stats, start, minimum, line!());
        steps.push(SortStep::MarkSorted {
            i: start,
            source_line: line!(),
        });
    }

    SortResult { steps, stats }
}
