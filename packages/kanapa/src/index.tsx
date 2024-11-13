import "server-only";
import type { ReactElement } from "react";
import { codeToHtml } from "shiki";

export let config = {
  themes: { light: "vitesse-light", dark: "vitesse-dark" },
};

export type CodeProps = {
  /**
   * The language of the code block
   * See supported languages for `shiki` at https://github.com/shikijs/shiki/blob/main/docs/languages.md
   */
  lang: string;
  /**
   * The code to highlight
   */
  children?: string;
  /**
   * The code to highlight
   */
  code?: string;
  /**
   * The theme to use for the code block
   * See supported themes for `shiki` at https://github.com/shikijs/shiki/blob/main/docs/themes.md
   */
  theme?: string;
};

export async function Code({
  lang,
  children,
  code,
  theme,
}: CodeProps): Promise<ReactElement> {
  if (!code && !children) {
    throw new Error("One of `code` or `children` props are required!");
  }

  let codeToHighlight = (code || children) as string;

  let pendingHighlights: Array<{
    themeType: string;
    highlighted: Promise<string>;
  }> = [];

  for (let [themeType, theme] of Object.entries(config.themes)) {
    pendingHighlights.push({
      themeType,
      highlighted: codeToHtml(codeToHighlight, {
        lang,
        theme,
      }),
    });
  }

  let styleString = [
    "@media (prefers-color-scheme: light) {",
    ".kanapa-dark { display: none; }",
    "}",
    "@media (prefers-color-scheme: dark) {",
    ".kanapa-light { display: none; }",
    "}",
  ]
    // Combine to a single string
    .join("")
    // Remove all whitespace
    .replace(/\s+/g, "");

  return (
    <>
      <style
        // @ts-expect-error - React added this to de-dupe style tags apparently
        href="kanapa-styles"
        precedence="high"
      >
        {styleString}
      </style>
      {pendingHighlights.map(async ({ themeType, highlighted }) => (
        <pre
          key={themeType}
          className={`kanapa-${themeType} kanapa-pre`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: We've converted the code to HTML
          dangerouslySetInnerHTML={{ __html: await highlighted }}
        />
      ))}
    </>
  );
}

export type MDXCodeProps = {
  // A React component that contains the code to highlight
  children: ReactElement<{ children: string; className: string }>;
};

/**
 * A component that can be used to highlight code
 *
 * This component is meant to be used as a drop-in
 * for transformed MDX code blocks, usually in conjunction
 * with the `rehype-mdx-code-props` rehype plugin.
 *
 * See here for an example:
 */
export async function MDXCode(props: MDXCodeProps): Promise<ReactElement> {
  let code = props?.children?.props?.children;
  let lang = "text";
  let classes = props?.children?.props?.className.split(" ");
  for (let cls of classes) {
    if (cls.startsWith("language-")) {
      lang = cls.split("language-")[1];
      break;
    }
  }
  return <Code lang={lang}>{code}</Code>;
}
