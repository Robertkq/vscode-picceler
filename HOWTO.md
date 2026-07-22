# Visual Studio Code Extension - Development & Publishing HOWTO

This guide details the tools, build commands, and steps required to package and publish the vscode-picceler extension to the Visual Studio Marketplace.

---

## 1. Core Tooling & npx Explained

### What is npx?
npx comes bundled with Node.js and npm. It allows you to run binaries from npm packages directly in your terminal without needing to install them globally on your system.

### What is vsce?
vsce (Visual Studio Code Extension) is the official CLI tool created by Microsoft for packaging, testing, and publishing VS Code extensions. 

Using `npx @vscode/vsce <command>` ensures you always execute the latest official packaging tool directly in your project directory.

---

## 2. Essential CLI Commands

Run these commands from the root directory of your extension project (`vscode-picceler`):

### Test / Package Locally
Generates a `.vsix` installer file without publishing it directly to the store.

npx @vscode/vsce package

* Output: `vscode-picceler-X.Y.Z.vsix`
* Use Case: Local testing (using "Extensions: Install from VSIX..." in VS Code) or manual web uploads.

### Version Management
Before releasing an update (e.g., fixing README assets or adding features), bump the version in `package.json`:

npm version patch

Or manually update `"version": "0.0.2"` inside `package.json`.

---

## 3. Web Upload & Publishing Process

Instead of managing Azure DevOps Personal Access Tokens (PATs) in the terminal, you can manage and publish releases directly via the web portal.

### Marketplace Management Portal
* URL: https://marketplace.visualstudio.com/manage
* Publisher Profile: Robertkq

### Publishing Steps:
1. Ensure your latest changes and README assets (e.g., `images/demo.gif`) are committed and pushed to GitHub. (VS Code fetches relative README images directly from your public GitHub repository).
2. Increment the `"version"` field in `package.json`.
3. Build the binary package:

npx @vscode/vsce package

4. Open the Visual Studio Marketplace Management Page (https://marketplace.visualstudio.com/manage).
5. Click the "..." (More Actions) button next to your extension listing and select Update.
6. Upload the newly generated `.vsix` file.

Verification usually takes 2 to 5 minutes. Once verified, the update will automatically