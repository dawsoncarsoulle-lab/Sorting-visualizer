mod bubble;

pub use bubble::bubble_sort;

#[cfg(test)]
pub(crate) fn replay_steps(mut values: Vec<u32>, steps: &[crate::model::SortStep]) -> Vec<u32> {
    use crate::model::SortStep;

    for step in steps {
        match step {
            SortStep::Swap { i, j } => values.swap(*i, *j),
            SortStep::Set { i, value } => values[*i] = *value,
            SortStep::Compare { .. } | SortStep::MarkSorted { .. } => {}
        }
    }

    values
}
