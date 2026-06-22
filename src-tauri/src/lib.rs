mod algorithms;
mod commands;
pub mod model;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::ping,
            commands::generate_sort_steps
        ])
        .run(tauri::generate_context!())
        .expect("failed to run SortFlow");
}
