# `kanapa`

A syntax highlighting code block component based on `shiki` for use with React Server Components!

> [!IMPORTANT]
> This library is only supported within React Server Components,
> it may work in other environments but they will not be officially supported at this time!

## Getting Started:

```bash
bun add kanapa
```

## Usage:

```tsx
import { Code } from "kanapa";

async function MyServerComponent() {
  return (
    <div>
      <Code
        lang="json"
        code={`{
  "someKey": "someValue"
}`}
      />
    </div>
  );
}
```

## Exports:

- `Code` - A highlighted code block component
  - Props:
    - `code?: string` - the code to be highlighted
    - `children?: string` - alternative to the `code` prop, code to be highlighted (if both `code` and `children` are provided, the `code` prop will win out)
    - `lang: string` - the language of the code, used for syntax highlighting, see [supported languages](https://github.com/shikijs/shiki/blob/main/docs/languages.md)
    - `theme?: string` - an optional theme override for the code block, this will no longer render the "fallback" themed code block, see [supported themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md)
    - `className?: string` - an optional classname to apply to a wrapping element
- `MDXCode` - A highlighted code block component meant for use within transformed mdx (see [#mdx](#mdx) for more details)
  - Props:
    - `children: ReactElement` - the `code` react element to be highlighted
    - `className?: string` - An optional classname to apply to the wrapping element
- `updateConfig` - a function to update the config for all `Code` and `MDXCode` components
  - Arguments:
    - `newConfig: Config` - the new config to set
- `config` - a live binding to the current config object

## Config:

This library supports a runtime config with the following options:

- `themes: Record<'light' | 'dark', string>` - an object map of light and dark themes to use for code blocks
- `selectors: 'system' | Record<'light' | 'dark', string>` - the type of selectors to use to pick between the light or dark themed code block

Example configs:

```ts
updateConfig({
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  // Uses media queries to pick the current desired user theme
  selectors: 'system',
});

updateConfig({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark'
  },
  selectors: {
    light: 'html.light',
    dark: 'html.dark',
  },
})
```

## MDX:

If you're rendering code blocks from mdx content, then you'll want to use the `MDXCode` export. Additionally I recommend using the `rehype-mdx-code-props` rehype plugin to automatically extract metadata on the code block and pass it as props to the `code` element (e.g. for passing the language down to the code block).

For frameworks that expose a `mdx-components.tsx` file (e.g. Next.js's `@next/mdx` setup), you'll want to map the `'pre'` html element to the `MDXCode` component, e.g.:

```ts
// mdx-components.tsx

export function useMDXComponents() {
  return {
    pre: MDXCode
  }
}
```

## Contributing:

### Building:

This library uses [`swc`](https://swc.rs/) and [`TypeScript`](https://www.typescriptlang.org/docs/) to build the source code and generate types.

To build the library, run `bun run build` from the root, or from this workspace!

### Code Quality:

#### Type Checking:

This library uses TypeScript to perform type checks, run `bun run type-check` from the root or from this workspace!

#### Linting

This library uses [BiomeJS](https://biomejs.dev/) for linting, run `bun run lint` from the root or from this workspace!

#### Tests

This library uses Bun for running unit tests, run `bun run test` from the root or from this workspace!

### Publishing:

To publish the library, run `bun run pub` from the workspace root. This will prompt you to login to npm and publish the package.

> Note: In the future, we will automate this process using GitHub Actions. And also add in tooling to manage releases / changelogs!
