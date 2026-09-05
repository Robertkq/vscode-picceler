// @ts-check
"use strict";

const vscode = require("vscode");

/**
 * Static signature table for Picceler's builtin functions, mirroring LANGUAGE.md
 * and src/mlir_gen.cpp's registerBuiltinFunctions() in the picceler repo.
 *
 * This is NOT a type checker — it can't validate argument types, only show the
 * expected shape of a call.
 */
const BUILTINS = {
  load_image: { params: [["string", "path"]], returns: "image", doc: "Loads the image at `path` and returns it." },
  save_image: { params: [["image", "img"], ["string", "path"]], returns: "", doc: "Saves `img` to `path`." },
  show_image: { params: [["image", "img"]], returns: "", doc: "Opens a window to display `img`." },
  read_number: { params: [["string", "prompt"]], returns: "float64", doc: "Prompts with `prompt` and reads a number from the keyboard." },
  read_string: { params: [["string", "prompt"]], returns: "string", doc: "Prompts with `prompt` and reads a string from the keyboard." },
  print: { params: [["string", "fmt"], ["...", "args"]], returns: "", doc: "Prints `fmt`, substituting each `{}` placeholder in order with the remaining arguments." },
  sqrt: { params: [["float64", "value"]], returns: "float64", doc: "Square root of `value`." },
  pow: { params: [["float64", "base"], ["float64", "exponent"]], returns: "float64", doc: "`base` raised to the power of `exponent`." },
  brightness: { params: [["image", "img"], ["int64", "value"]], returns: "image", doc: "Eltwise addition of `value` to every pixel of `img`." },
  invert: { params: [["image", "img"]], returns: "image", doc: "Eltwise inversion of every pixel of `img` (`255 - pixel`)." },
  convolution: { params: [["image", "img"], ["kernel", "k"]], returns: "image", doc: "Performs a convolution on `img` using `k`." },
  sharpen: { params: [["image", "img"], ["int64", "value"]], returns: "image", doc: "Increases the sharpness of `img` by `value`." },
  box_blur: { params: [["image", "img"], ["int64", "radius"]], returns: "image", doc: "Applies a box blur to `img`, averaging pixels within `radius`." },
  gaussian_blur: { params: [["image", "img"], ["int64", "radius"]], returns: "image", doc: "Applies a gaussian blur to `img` based on `radius`." },
  edge_detect: { params: [["image", "img"]], returns: "image", doc: "Detects and highlights outlines and edges within `img`." },
  emboss: { params: [["image", "img"]], returns: "image", doc: "Applies a 3D effect to `img` by highlighting pixel intensity differences." },
  rotate: { params: [["image", "img"], ["int64", "angle"]], returns: "image", doc: "Rotates `img` by `angle` degrees (multiples of 90)." },
  crop: { params: [["image", "img"], ["int64", "x"], ["int64", "y"], ["int64", "width"], ["int64", "height"]], returns: "image", doc: "Crops `img` to the `width`x`height` rectangle at (`x`, `y`)." },
  dilate: { params: [["image", "img"], ["int64", "radius"]], returns: "image", doc: "Expands bright regions of `img` using a `radius`-sized neighborhood." },
  erode: { params: [["image", "img"], ["int64", "radius"]], returns: "image", doc: "Shrinks bright regions of `img` using a `radius`-sized neighborhood." },
  diff: { params: [["image", "img1"], ["image", "img2"]], returns: "image", doc: "Computes the pixel-wise difference between `img1` and `img2`." },
  blend: { params: [["image", "img1"], ["image", "img2"], ["float64", "weight"]], returns: "image", doc: "Blends `img1` and `img2` using `weight` as the mix factor." },
};

function signatureLabel(name, info) {
  const params = info.params.map(([type, param]) => `${type} ${param}`).join(", ");
  const arrow = info.returns ? ` -> ${info.returns}` : "";
  return `${name}(${params})${arrow}`;
}

/** Strips string-literal contents and line comments so leftover parens/commas
 * only come from real call syntax. Length is preserved so offsets still line up. */
function stripStringsAndComments(text) {
  return text
    .replace(/"(?:\\.|[^"\\])*"/g, (m) => "x".repeat(m.length))
    .replace(/#.*$/gm, (m) => " ".repeat(m.length));
}

/** Scans cleaned text for the call enclosing `offset`, returning
 * { name, argIndex } or null if the cursor isn't inside a call's parens. */
function findEnclosingCall(cleanedText, offset) {
  const stack = [];
  for (let i = 0; i < offset; i++) {
    const ch = cleanedText[i];
    if (ch === "(") {
      let j = i - 1;
      while (j >= 0 && /\s/.test(cleanedText[j])) j--;
      let end = j + 1;
      while (j >= 0 && /[A-Za-z0-9_]/.test(cleanedText[j])) j--;
      const name = cleanedText.slice(j + 1, end);
      stack.push({ name, argIndex: 0 });
    } else if (ch === ")") {
      stack.pop();
    } else if (ch === "," && stack.length > 0) {
      stack[stack.length - 1].argIndex++;
    }
  }
  return stack.length > 0 ? stack[stack.length - 1] : null;
}

function activate(context) {
  const hoverProvider = vscode.languages.registerHoverProvider("picceler", {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position);
      if (!range) return undefined;
      const word = document.getText(range);
      const info = BUILTINS[word];
      if (!info) return undefined;

      const md = new vscode.MarkdownString();
      md.appendCodeblock(signatureLabel(word, info), "picceler");
      md.appendMarkdown(info.doc);
      return new vscode.Hover(md, range);
    },
  });

  const signatureHelpProvider = vscode.languages.registerSignatureHelpProvider(
    "picceler",
    {
      provideSignatureHelp(document, position) {
        const text = stripStringsAndComments(document.getText());
        const offset = document.offsetAt(position);
        const call = findEnclosingCall(text, offset);
        if (!call || !BUILTINS[call.name]) return undefined;

        const info = BUILTINS[call.name];
        const label = signatureLabel(call.name, info);
        const signature = new vscode.SignatureInformation(label, new vscode.MarkdownString(info.doc));
        signature.parameters = info.params.map(([type, param]) => new vscode.ParameterInformation(`${type} ${param}`));

        const help = new vscode.SignatureHelp();
        help.signatures = [signature];
        help.activeSignature = 0;
        help.activeParameter = Math.min(call.argIndex, Math.max(info.params.length - 1, 0));
        return help;
      },
    },
    "(",
    ","
  );

  const completionProvider = vscode.languages.registerCompletionItemProvider("picceler", {
    provideCompletionItems() {
      return Object.entries(BUILTINS).map(([name, info]) => {
        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
        item.detail = signatureLabel(name, info);
        item.documentation = new vscode.MarkdownString(info.doc);
        const placeholders = info.params.map(([, param], idx) => `\${${idx + 1}:${param}}`).join(", ");
        item.insertText = new vscode.SnippetString(`${name}(${placeholders})`);
        return item;
      });
    },
  });

  context.subscriptions.push(hoverProvider, signatureHelpProvider, completionProvider);
}

function deactivate() {}

module.exports = { activate, deactivate };
