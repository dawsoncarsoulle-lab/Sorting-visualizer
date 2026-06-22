use crate::{algorithms::bubble_sort, model::SortResult};

#[tauri::command]
pub fn ping() -> String {
    "pong".to_owned()
}

#[tauri::command]
pub fn generate_sort_steps(algorithm: String, values: Vec<u32>) -> Result<SortResult, String> {
    match algorithm.as_str() {
        "bubble" => Ok(bubble_sort(values)),
        _ => Err(format!("unknown sorting algorithm: {algorithm}")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_unknown_algorithms() {
        let error = generate_sort_steps("bogus".to_owned(), vec![2, 1]).unwrap_err();
        assert!(error.contains("bogus"));
    }
}
