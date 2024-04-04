# FRC VendorDep Update Action

[![GitHub Super-Linter](https://github.com/garrettsummerfi3ld/frc-vendordep-update-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/garrettsummerfi3ld/frc-vendordep-update-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/garrettsummerfi3ld/frc-vendordep-update-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/garrettsummerfi3ld/frc-vendordep-update-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/garrettsummerfi3ld/frc-vendordep-update-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/garrettsummerfi3ld/frc-vendordep-update-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Updates FRC vendordeps in your repository.

**_Work in progress._**

## Config options

| Option    | Description                                               | Default Value                                                        |
| --------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| `dir`     | Directory of the vendordeps to look for                   | `./vendordeps`                                                       |
| `author`  | Author of the commit that is getting pull requested       | `github-actions[bot] <github-actions[bot]@users.noreply.github.com>` |
| `token`   | The token to be used for the commit                       | `GITHUB_TOKEN`                                                       |
| `dry-run` | Runs the action in a read-only state, not making a commit | `false`                                                              |
