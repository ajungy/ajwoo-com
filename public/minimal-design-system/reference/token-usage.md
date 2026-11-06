# Token setup and usage

The reusable base tokens live in `tokens/`, relative to SKILL.md.
Copy that folder into your project. Keep all three files together.
Fonts and Figma component instances are separate assets. The CSS uses a font
stack, but does not download font binaries. See LICENSE-AND-ASSETS.md for
self-hosting font files and their notices.

## Tailwind CSS 3.4

This preset targets Tailwind 3.4. For a project using Tailwind 4, use the CSS
variables directly or adapt the preset explicitly before adopting it.

Import `./tokens/tokens.css` once in your application entry or global stylesheet.
Adjust the relative path for your project. Configure Tailwind to scan your
actual source folders.

```js
// tailwind.config.cjs
module.exports = {
  presets: [require('./tokens/tailwind.preset.js')],
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
};
```

```html
<div class="bg-page p-page text-fg">
  <h1 class="text-h1">Project title</h1>
  <p class="mt-4 text-body text-fg-secondary">Supporting text.</p>
  <button class="mt-6 h-control-md rounded-control bg-primary px-6 text-primary-fg">
    Continue
  </button>
</div>
```

Use `can-hover:hover:` for hover states so touch devices do not retain them.
Use the same semantic classes in both themes.

## CSS without Tailwind

```css
@import "./tokens/tokens.css";

.panel {
  background: var(--surface-page);
  color: var(--text-primary);
  padding: var(--s-8);
}
```

Use the exact names defined in tokens.css. Semantic variables describe roles.
Primitive colors are inputs to semantic values and should not be applied
directly to components.

## Light and dark

Set `data-theme="light"` or `data-theme="dark"` on the root HTML element.
Omitting the attribute follows the operating system. The CSS uses light-dark().
For older browsers, compile explicit light and dark values for your targets.

## Spacing

The custom spacing indices are not Tailwind's default pixel values.

| Index | px |
|---|---|
| 0 | 0 |
| 1 | 2 |
| 2 | 4 |
| 3 | 6 |
| 4 | 8 |
| 5 | 12 |
| 6 | 16 |
| 7 | 20 |
| 8 | 24 |
| 9 | 32 |
| 10 | 40 |
| 11 | 48 |
| 12 | 64 |
| 13 | 80 |
| 14 | 96 |
| 15 | 128 |

For example, `gap-4` is 8 px and `mt-7` is 20 px.
Check the preset before using indices outside this scale.

## Figma tokens

tokens.json contains DTCG token data. Use a compatible token importer such as
Tokens Studio, then map the semantic light and dark values to Figma variable
modes. Figma does not universally accept this JSON as a native Variables import.
Bind component properties to semantic variables.
