use serde::Serialize;

use super::SortStep;

#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize)]
pub struct SortStats {
    pub comparisons: usize,
    pub swaps: usize,
    pub writes: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct SortResult {
    pub steps: Vec<SortStep>,
    pub stats: SortStats,
}
