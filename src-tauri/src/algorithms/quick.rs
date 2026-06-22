use crate::model::{SortResult, SortStats, SortStep};

use super::{record_compare, record_swap};

pub fn quick_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();

    if !values.is_empty() {
        let high = values.len() - 1;
        sort_range(&mut values, &mut steps, &mut stats, 0, high);
    }

    SortResult { steps, stats }
}

fn sort_range(
    values: &mut [u32],
    steps: &mut Vec<SortStep>,
    stats: &mut SortStats,
    low: usize,
    high: usize,
) {
    if low == high {
        steps.push(SortStep::MarkSorted {
            i: low,
            source_line: line!(),
        });
        return;
    }

    let pivot = values[high];
    let mut boundary = low;

    for scan in low..high {
        record_compare(steps, stats, scan, high, line!());
        if values[scan] <= pivot {
            record_swap(values, steps, stats, boundary, scan, line!());
            boundary += 1;
        }
    }
    record_swap(values, steps, stats, boundary, high, line!());
    steps.push(SortStep::MarkSorted {
        i: boundary,
        source_line: line!(),
    });

    if boundary > low {
        sort_range(values, steps, stats, low, boundary - 1);
    }
    if boundary < high {
        sort_range(values, steps, stats, boundary + 1, high);
    }
}
