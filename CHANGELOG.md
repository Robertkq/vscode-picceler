# Change Log

All notable changes to the "vscode-picceler" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release

## [0.0.3]

- Added highlighting for type keywords (`int64`, `float64`, `string`, `image`, `kernel`), scoped as
  `storage.type.picceler`.
- Added the missing `sqrt`/`pow` builtins to the grammar, and removed the stale
  `string.const`/`kernel.const` entries (those are internal MLIR op mnemonics, never picceler
  syntax).
- Added hover, signature help (parameter hints while typing a call), and snippet completion for all
  22 builtin functions, driven by a static table in `extension.js` — no build step, no
  dependencies.