use crate::model::{SortResult, SortStats};

use super::{mark_all_sorted, record_compare, record_swap};

pub fn insertion_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();

    for index in 1..values.len() {
        let mut current = index;
        while current > 0 {
            record_compare(&mut steps, &mut stats, current - 1, current, line!());
            if values[current - 1] <= values[current] {
                break;
            }
            record_swap(
                &mut values,
                &mut steps,
                &mut stats,
                current - 1,
                current,
                line!(),
            );
            current -= 1;
        }
    }

    mark_all_sorted(&mut steps, values.len(), line!());
    SortResult { steps, stats }
}
