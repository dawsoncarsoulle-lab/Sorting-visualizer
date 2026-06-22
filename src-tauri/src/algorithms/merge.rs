use crate::model::{SortResult, SortStats};

use super::{mark_all_sorted, record_compare, record_write};

pub fn merge_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();
    let len = values.len();

    sort_range(&mut values, &mut steps, &mut stats, 0);
    mark_all_sorted(&mut steps, len, line!());
    SortResult { steps, stats }
}

fn sort_range(
    values: &mut [u32],
    steps: &mut Vec<crate::model::SortStep>,
    stats: &mut SortStats,
    offset: usize,
) {
    if values.len() < 2 {
        return;
    }

    let middle = values.len() / 2;
    sort_range(&mut values[..middle], steps, stats, offset);
    sort_range(&mut values[middle..], steps, stats, offset + middle);

    let left = values[..middle].to_vec();
    let right = values[middle..].to_vec();
    let (mut left_index, mut right_index, mut target) = (0, 0, 0);

    while left_index < left.len() && right_index < right.len() {
        record_compare(
            steps,
            stats,
            offset + left_index,
            offset + middle + right_index,
            line!(),
        );
        let value = if left[left_index] <= right[right_index] {
            let value = left[left_index];
            left_index += 1;
            value
        } else {
            let value = right[right_index];
            right_index += 1;
            value
        };
        record_write(
            values,
            steps,
            stats,
            target,
            offset + target,
            value,
            line!(),
        );
        target += 1;
    }

    while left_index < left.len() {
        record_write(
            values,
            steps,
            stats,
            target,
            offset + target,
            left[left_index],
            line!(),
        );
        left_index += 1;
        target += 1;
    }
    while right_index < right.len() {
        record_write(
            values,
            steps,
            stats,
            target,
            offset + target,
            right[right_index],
            line!(),
        );
        right_index += 1;
        target += 1;
    }
}
