use crate::{
    algorithms::{list_algorithms as algorithm_catalog, run_algorithm},
    model::{AlgorithmInfo, SortResult},
};

const MAX_VALUES: usize = 2_000;

#[tauri::command]
pub fn ping() -> String {
    "pong".to_owned()
}

#[tauri::command]
pub fn list_algorithms() -> Vec<AlgorithmInfo> {
    algorithm_catalog()
}

#[tauri::command]
pub fn generate_sort_steps(algorithm: String, values: Vec<u32>) -> Result<SortResult, String> {
    if values.len() > MAX_VALUES {
        return Err(format!("too many values: max is {MAX_VALUES}"));
    }

    run_algorithm(&algorithm, values)
        .ok_or_else(|| format!("unknown sorting algorithm: {algorithm}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_unknown_algorithms() {
        let error = generate_sort_steps("bogus".to_owned(), vec![2, 1]).unwrap_err();
        assert!(error.contains("bogus"));
    }

    #[test]
    fn rejects_too_many_values() {
        let error = generate_sort_steps("bubble".to_owned(), vec![1; MAX_VALUES + 1]).unwrap_err();
        assert!(error.contains("too many values"));
    }

    #[test]
    fn accepts_every_registered_algorithm() {
        for algorithm in [
            "bubble",
            "selection",
            "insertion",
            "cocktail",
            "comb",
            "shell",
            "quick",
            "merge",
            "heap",
            "gnome",
        ] {
            assert!(generate_sort_steps(algorithm.to_owned(), vec![3, 1, 2]).is_ok());
        }
    }

    #[test]
    fn exposes_the_algorithm_catalog() {
        let catalog = list_algorithms();
        assert_eq!(catalog.len(), 10);
        assert!(catalog.iter().all(|algorithm| !algorithm.source.is_empty()));
    }
}
