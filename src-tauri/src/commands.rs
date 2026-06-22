use crate::{
    algorithms::{list_algorithms as algorithm_catalog, run_algorithm},
    model::{AlgorithmInfo, SortResult},
};

const MAX_VALUES: usize = 2_000;
const MAX_STEPS: usize = 250_000;

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

    let result = run_algorithm(&algorithm, values)
        .ok_or_else(|| format!("unknown sorting algorithm: {algorithm}"))?;

    if result.steps.len() > MAX_STEPS {
        return Err(format!("too many animation steps: max is {MAX_STEPS}"));
    }

    Ok(result)
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

    #[test]
    fn rejects_results_with_too_many_animation_steps() {
        let values: Vec<u32> = (0..600).rev().collect();
        let error = generate_sort_steps("bubble".to_owned(), values).unwrap_err();
        assert!(error.contains("too many animation steps"));
    }

    #[test]
    fn shaker_and_quick_support_the_max_frontend_size() {
        let mut seed = 0x5eed_u32;
        let values: Vec<u32> = (0..200)
            .map(|_| {
                seed = seed.wrapping_mul(1_664_525).wrapping_add(1_013_904_223);
                seed % 200
            })
            .collect();

        for algorithm in ["cocktail", "quick"] {
            let result = generate_sort_steps(algorithm.to_owned(), values.clone())
                .unwrap_or_else(|error| panic!("{algorithm} failed: {error}"));
            assert!(!result.steps.is_empty());
            assert!(result.steps.len() <= MAX_STEPS);
        }
    }
}
