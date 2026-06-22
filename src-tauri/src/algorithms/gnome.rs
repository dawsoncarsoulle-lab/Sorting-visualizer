use crate::model::{SortResult, SortStats};

use super::{mark_all_sorted, record_compare, record_swap};

pub fn gnome_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();
    let mut index = 1;

    while index < values.len() {
        record_compare(&mut steps, &mut stats, index - 1, index, line!());
        if values[index - 1] <= values[index] {
            index += 1;
        } else {
            record_swap(
                &mut values,
                &mut steps,
                &mut stats,
                index - 1,
                index,
                line!(),
            );
            index = index.saturating_sub(1).max(1);
        }
    }

    mark_all_sorted(&mut steps, values.len(), line!());
    SortResult { steps, stats }
}
