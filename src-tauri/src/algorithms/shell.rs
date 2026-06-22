use crate::model::{SortResult, SortStats};

use super::{mark_all_sorted, record_compare, record_swap};

pub fn shell_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();
    let mut gap = values.len() / 2;

    while gap > 0 {
        for index in gap..values.len() {
            let mut current = index;
            while current >= gap {
                record_compare(&mut steps, &mut stats, current - gap, current, line!());
                if values[current - gap] <= values[current] {
                    break;
                }
                record_swap(
                    &mut values,
                    &mut steps,
                    &mut stats,
                    current - gap,
                    current,
                    line!(),
                );
                current -= gap;
            }
        }
        gap /= 2;
    }

    mark_all_sorted(&mut steps, values.len(), line!());
    SortResult { steps, stats }
}
