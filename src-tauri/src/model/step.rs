use serde::Serialize;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(tag = "type")]
pub enum SortStep {
    Compare {
        i: usize,
        j: usize,
        #[serde(rename = "sourceLine")]
        source_line: u32,
    },
    Swap {
        i: usize,
        j: usize,
        #[serde(rename = "sourceLine")]
        source_line: u32,
    },
    Set {
        i: usize,
        value: u32,
        #[serde(rename = "sourceLine")]
        source_line: u32,
    },
    MarkSorted {
        i: usize,
        #[serde(rename = "sourceLine")]
        source_line: u32,
    },
}

impl SortStep {
    pub fn source_line(&self) -> u32 {
        match self {
            Self::Compare { source_line, .. }
            | Self::Swap { source_line, .. }
            | Self::Set { source_line, .. }
            | Self::MarkSorted { source_line, .. } => *source_line,
        }
    }
}
