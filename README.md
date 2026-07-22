# Picceler Language Support for Visual Studio Code

Official syntax highlighting and language configuration for **Picceler**—a custom DSL for image processing and hardware acceleration.

<p align="center">
  <img src="images/demo.gif" alt="Picceler Syntax Highlighting Demo" width="700"/>
</p>

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

* **Syntax Highlighting**: Rich tokenization for Picceler functions (`def`, `return`), comments (`#`), strings, numbers, and operators.
* **Built-in Dialect Ops**: Full highlighting for native image processing intrinsics:
  * **I/O & Utilities**: `load_image`, `save_image`, `show_image`, `print`, `read_string`, `read_number`
  * **Filters**: `brightness`, `invert`, `sharpen`, `box_blur`, `gaussian_blur`, `edge_detect`, `emboss`, `rotate`
  * **Algorithms & Morphology**: `convolution`, `erode`, `dilate`, `diff`, `blend`, `crop`
  * **Constants**: `string.const`, `kernel.const`
* **Language Integration**: Automatic file detection for `.pic` scripts, comment toggling (`#`), and auto-closing bracket/quote pairs.

---

## Requirements

* No external runtime or Node.js dependencies are required for syntax highlighting!
* To compile `.pic` source files, ensure you have the `picceler` binary installed and accessible in your system path.

---

## Extension Settings


* Currently, this extension relies on native VS Code tokenization and does not contribute custom configuration settings.

---

## Known Issues

* None reported at this time. If you run into syntax rendering issues or missing ops, feel free to open an issue on the repository!

---

## Release Notes

### 0.0.2

* Initial release of Picceler VS Code extension.
* Added syntax highlighting for core control structures, comments (`#`), strings, and all 22 TableGen dialect operations.
* Added native bracket matching and auto-closing configurations for `.pic` files.
* fix demo gif, add more documentation on HOWTO, AI assistance notice

---

## Developer note

* **AI Assistance:** This extension, its syntax highlighting configurations, and supporting scripts were built with heavy reliance on AI tools. 
* **Asset Credits:** The extension icon was generated using AI. 
* **Design Philosophy:** Written as a pragmatic wrapper to handle basic editor tooling and language support for Picceler—because spending hours manually writing boilerplate editor extensions by hand isn't worth the time.

# Please Enjoy! 