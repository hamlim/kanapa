import "server-only";
import type { ReactElement } from "react";
import { codeToHtml } from "shiki";

export type Config = {
  themes: {
    light: string;
    dark: string;
  };
  selectors:
    | "system"
    | {
        light: string;
        dark: string;
      };
};

export let config: Config = {
  themes: { light: "vitesse-light", dark: "vitesse-dark" },
  selectors: "system",
};

export function updateConfig(newConfig: Config): void {
  config = newConfig;
}

let lightSystemSelector = [
  "@media (prefers-color-scheme: light) {",
  ".kanapa-dark:not(.kanapa-override) { display: none; }",
  "}",
];

let darkSystemSelector = [
  "@media (prefers-color-scheme: dark) {",
  ".kanapa-light:not(.kanapa-override) { display: none; }",
  "}",
];

let systemStyleString = [...lightSystemSelector, ...darkSystemSelector]
  // Combine to a single string
  .join("")
  // Remove all whitespace
  .replace(/\s+/g, "");

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
   * Preferred theme to use for the code block
   *
   * If provided, the fallback themes won't be used!
   */
  theme?: "light" | "dark";
  /**
   * An optional className to add to each wrapping element
   */
  className?: string;
};

export async function Code({
  lang,
  children,
  code,
  theme,
  className,
}: CodeProps): Promise<ReactElement> {
  if (!code && !children) {
    throw new Error("One of `code` or `children` props are required!");
  }

  let codeToHighlight = (code || children) as string;

  if (theme) {
    let highlighted = await codeToHtml(codeToHighlight, {
      lang,
      theme,
    });

    return (
      <div
        className={`kanapa-${theme} kanapa-override kanapa-wrap${className ? ` ${className}` : ""}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: We've converted the code to HTML
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    );
  }

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

  let styleString: string;

  if (config.selectors === "system") {
    styleString = systemStyleString;
  } else if (
    typeof config.selectors.light === "string" &&
    typeof config.selectors.dark === "string"
  ) {
    styleString = [
      `:where(${config.selectors.light}) .kanapa-dark:not(.kanapa-override){display:none;}`,
      `:where(${config.selectors.dark}) .kanapa-light:not(.kanapa-override){display:none;}`,
    ]
      // Combine to a single string
      .join("");
    // Not safe to remove all whitespaces, since we need to preserve the space between the selectors
  } else {
    throw new Error(
      "Invalid `config.selectors` configuration, must be either 'system' or an object with both light and dark key-value pairs",
    );
  }

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
        <div
          key={themeType}
          className={`kanapa-${themeType} kanapa-wrap${className ? ` ${className}` : ""}`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: We've converted the code to HTML
          dangerouslySetInnerHTML={{ __html: await highlighted }}
        />
      ))}
    </>
  );
}

export type MDXCodeProps = {
  /**
   * A React component that contains the code to highlight
   */
  children: ReactElement<{ children: string; className: string }>;
  /**
   * An optional className to add to the wrapping element
   */
  className?: string;
};

/**
 * A component that can be used to highlight code
 *
 * This component is meant to be used as a drop-in
 * for transformed MDX code blocks, usually in conjunction
 * with the `rehype-mdx-code-props` rehype plugin.
 *
 * See here for an example: @TODO
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
  return (
    <Code className={props.className} lang={lang}>
      {code}
    </Code>
  );
}
