use serde::Serialize;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(tag = "type")]
pub enum SortStep {
    Compare { i: usize, j: usize },
    Swap { i: usize, j: usize },
    Set { i: usize, value: u32 },
    MarkSorted { i: usize },
}
