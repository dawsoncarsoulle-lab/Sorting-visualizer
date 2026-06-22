use crate::model::{SortResult, SortStats, SortStep};

use super::{mark_all_sorted, record_compare, record_swap};

pub fn cocktail_sort(input: Vec<u32>) -> SortResult {
    let mut values = input;
    let mut steps = Vec::new();
    let mut stats = SortStats::default();
    let len = values.len();

    if len < 2 {
        mark_all_sorted(&mut steps, len, line!());
        return SortResult { steps, stats };
    }

    let mut start = 0;
    let mut end = len - 1;

    loop {
        let mut swapped = false;
        for index in start..end {
            record_compare(&mut steps, &mut stats, index, index + 1, line!());
            if values[index] > values[index + 1] {
                record_swap(
                    &mut values,
                    &mut steps,
                    &mut stats,
                    index,
                    index + 1,
                    line!(),
                );
                swapped = true;
            }
        }
        steps.push(SortStep::MarkSorted {
            i: end,
            source_line: line!(),
        });

        if !swapped || start >= end - 1 {
            break;
        }
        end -= 1;
        swapped = false;

        for index in (start + 1..=end).rev() {
            record_compare(&mut steps, &mut stats, index - 1, index, line!());
            if values[index - 1] > values[index] {
                record_swap(
                    &mut values,
                    &mut steps,
                    &mut stats,
                    index - 1,
                    index,
                    line!(),
                );
                swapped = true;
            }
        }
        steps.push(SortStep::MarkSorted {
            i: start,
            source_line: line!(),
        });
        start += 1;

        if !swapped || start >= end {
            break;
        }
    }

    mark_all_sorted(&mut steps, len, line!());
    SortResult { steps, stats }
}
