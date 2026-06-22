use crate::model::{SortResult, SortStats};

use super::{mark_all_sorted, record_compare, record_swap};

pub fn comb_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();
    let mut gap = values.len();
    let mut swapped = true;

    while gap > 1 || swapped {
        gap = ((gap * 10) / 13).max(1);
        swapped = false;

        for index in 0..values.len().saturating_sub(gap) {
            let other = index + gap;
            record_compare(&mut steps, &mut stats, index, other, line!());
            if values[index] > values[other] {
                record_swap(&mut values, &mut steps, &mut stats, index, other, line!());
                swapped = true;
            }
        }
    }

    mark_all_sorted(&mut steps, values.len(), line!());
    SortResult { steps, stats }
}
