use crate::model::{SortResult, SortStats, SortStep};

use super::{mark_all_sorted, record_compare, record_swap};

pub fn heap_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();
    let len = values.len();

    for root in (0..len / 2).rev() {
        sift_down(&mut values, &mut steps, &mut stats, root, len);
    }

    for end in (1..len).rev() {
        record_swap(&mut values, &mut steps, &mut stats, 0, end, line!());
        steps.push(SortStep::MarkSorted {
            i: end,
            source_line: line!(),
        });
        sift_down(&mut values, &mut steps, &mut stats, 0, end);
    }

    if len > 0 {
        steps.push(SortStep::MarkSorted {
            i: 0,
            source_line: line!(),
        });
    } else {
        mark_all_sorted(&mut steps, len, line!());
    }
    SortResult { steps, stats }
}

fn sift_down(
    values: &mut [u32],
    steps: &mut Vec<SortStep>,
    stats: &mut SortStats,
    mut root: usize,
    heap_size: usize,
) {
    loop {
        let left = root * 2 + 1;
        if left >= heap_size {
            return;
        }

        let mut largest = root;
        record_compare(steps, stats, largest, left, line!());
        if values[left] > values[largest] {
            largest = left;
        }

        let right = left + 1;
        if right < heap_size {
            record_compare(steps, stats, largest, right, line!());
            if values[right] > values[largest] {
                largest = right;
            }
        }

        if largest == root {
            return;
        }
        record_swap(values, steps, stats, root, largest, line!());
        root = largest;
    }
}
