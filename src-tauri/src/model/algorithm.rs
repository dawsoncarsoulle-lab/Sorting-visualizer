use serde::Serialize;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmInfo {
    pub id: &'static str,
    pub name: &'static str,
    pub family: &'static str,
    pub description: &'static str,
    pub source_path: &'static str,
    pub source: &'static str,
    pub best_case: &'static str,
    pub average_case: &'static str,
    pub worst_case: &'static str,
    pub stable: bool,
    pub in_place: bool,
    pub memory: &'static str,
}
