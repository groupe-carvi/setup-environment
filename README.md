# Carvi - Setup Environment

This action sets up and prepares the runner for various environments, including Rust, Node.js, Bun, Flutter, Android, iOS, and more. It allows you to configure your CI/CD pipeline with the necessary tools and dependencies.

## Inputs

The action accepts the following inputs:

| Input      | Description                                 | Default   |
|------------|---------------------------------------------|-----------|
| `rust`     | Set to `"true"` to setup Rust.              | `"false"` |
| `node`     | Set to `"true"` to setup Node.js.           | `"false"` |
| `bun`      | Set to `"true"` to setup Bun.               | `"false"` |
| `mobile`   | Set to `"true"` to setup Android SDK / iOS. | `"false"` |
| `flutter`  | Set to `"true"` to setup Flutter.           | `"false"` |
| `task`     | Set to `"true"` to setup Tasks.             | `"false"` |

## Outputs

The action provides the following outputs:

- **rustup-version**: The version of Rustup for the selected toolchain.
- **node-version**: The version of Node that was installed.
- **bun-version**: The selected Bun that was installed.
- **ndk-path**: Installation path for the Android NDK.
- **ndk-full-version**: Full version of the Android NDK.
- **flutter-channel**: The channel of the selected Flutter release.
- **flutter-version**: The version of Flutter for the selected channel.
- **flutter-architecture**: The selected Flutter CPU architecture.

## Usage

To use this action in your workflow, include it in your `.github/workflows/workflow.yml` see [action.yml](action.yml) or [examples](examples):

```yaml
name: CI Workflow

on: [push, pull_request]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Setup Environment
        uses: groupe-carvi/setup-environment@v1
        with:
          rust: "true"
          node: "true"
          bun: "true"
          mobile: "true"
          flutter: "true"
          task: "false"
```

### Example Workflow

Here’s an example of a complete workflow that sets up the environment with Rust, Node.js, Bun, and Flutter:

```yaml
name: Setup Environment Example

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Setup Environment
        uses: groupe-carvi/setup-environment@v1
        with:
          rust: true
          node: true
          bun: true
          mobile: true
          flutter: true
          task: true

      - name: Display Installed Versions
        run: |
          echo "Rustup Version: ${{ steps.rust.outputs.rustup-version }}"
          cargo --help
          echo "Node Version: ${{ steps.node.outputs.node-version }}"
          node --help
          echo "Bun Version: ${{ steps.bun.outputs.bun-version }}"
          bun --help
          echo "NDK Path: ${{ steps.ndk.outputs.ndk-path }}"
          echo "Flutter Channel: ${{ steps.flutter.outputs.flutter-channel }}"
          echo "Flutter Version: ${{ steps.flutter.outputs.flutter-version }}"
          echo "Flutter Architecture: ${{ steps.flutter.outputs.flutter-architecture }}"
          dart --help
          flutter --help
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.