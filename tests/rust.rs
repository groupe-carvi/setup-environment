
#[cfg(test)]
mod tests {
    use std::process::Command;

    #[test]
    fn rust_available() {
        // Attempt to get the Rust version
        let output = Command::new("rustc")
            .arg("--version")
            .output()
            .expect("Failed to execute rustc");
        
        // Check if the command was successful
        assert!(output.status.success(), "rustc command failed");
        
        // Convert the output to a string and check if it contains "rustc"
        let version = String::from_utf8_lossy(&output.stdout);
        assert!(version.contains("rustc"), "rustc is not available");
    }
}