import { Code, type CodeProps, updateConfig } from "kanapa";
import { StarIcon } from "lucide-react";
import type { Metadata } from "next";
import {
  Blockquote,
  H1,
  H2,
  InlineCode,
  Link,
  P,
  UnorderedList,
} from "~/components/typography";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const metadata: Metadata = {
  title:
    "Kanapa - A syntax highlighting code block component based on shiki for use with React Server Components",
  description:
    "Kanapa is a syntax highlighting code block component based on shiki for use with React Server Components",
  authors: [
    {
      name: "Matt Hamlin",
      url: "https://matthamlin.me",
    },
  ],
};

updateConfig({
  themes: {
    dark: "github-dark",
    light: "github-light",
  },
  selectors: {
    light: "html.light",
    dark: "html.dark",
  },
});

function CodeBlock(props: CodeProps) {
  return <Code {...props} className="[&>pre]:p-4 [&>pre]:rounded-md" />;
}

let sectionClasses =
  "py-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 max-w-[75ch] mx-auto min-h-[40vh] flex flex-col justify-center";

export default function Home() {
  return (
    <main>
      <header className={sectionClasses}>
        <H1>Kanapa</H1>
        <P>
          Kanapa is a syntax highlighting code block component based on shiki
          for use with React Server Components
        </P>

        <Blockquote>
          <P>kanapa is Maori for &quot;bright&quot;</P>
        </Blockquote>

        <P>
          Kanapa is built on top of{" "}
          <Link href="https://shiki.style/">
            <InlineCode>shiki</InlineCode>
          </Link>
          , and is meant to be a replacement for{" "}
          <Link href="https://bright.codehike.org/">
            <InlineCode>bright</InlineCode>
          </Link>
          .
        </P>

        <div className="pt-10 flex row justify-evenly items-center">
          <Button asChild>
            <a href="#installation">Get Started</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/hamlim/kanapa">
              <StarIcon className="mr-2 inline-flex" /> Star on GitHub
            </a>
          </Button>
        </div>
      </header>
      <section id="installation" className={sectionClasses}>
        <H2>Installation</H2>
        <P>Install Kanapa via your favorite package manager:</P>
        <div className="mt-6">
          <Tabs defaultValue="bun">
            <TabsList>
              <TabsTrigger value="bun">Bun</TabsTrigger>
              <TabsTrigger value="yarn">Yarn</TabsTrigger>
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
              <TabsTrigger value="npm">npm</TabsTrigger>
            </TabsList>
            <div className="my-10">
              <TabsContent value="bun">
                <CodeBlock lang="shell">bun install kanapa</CodeBlock>
              </TabsContent>
              <TabsContent value="yarn">
                <CodeBlock lang="shell">yarn add kanapa</CodeBlock>
              </TabsContent>
              <TabsContent value="pnpm">
                <CodeBlock lang="shell">pnpm install kanapa</CodeBlock>
              </TabsContent>
              <TabsContent value="npm">
                <CodeBlock lang="shell">npm install kanapa</CodeBlock>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
      <section id="usage" className={sectionClasses}>
        <H2>Exports:</H2>
        <P>
          <InlineCode>Kanapa</InlineCode> provides the following exports:
        </P>
        <UnorderedList>
          <li>
            <P>
              <InlineCode>Code</InlineCode> - A server component that renders a
              code block
            </P>
            <P>Props:</P>
            <UnorderedList>
              <li>
                <InlineCode>lang: string</InlineCode> - The language of the code
                block
              </li>
              <li>
                <InlineCode>code?: string</InlineCode> - The code to render
              </li>
              <li>
                <InlineCode>children?: string</InlineCode> - The code to render
                (either <InlineCode>children</InlineCode> or{" "}
                <InlineCode>code</InlineCode> props will work - the{" "}
                <InlineCode>code</InlineCode> prop will take precedence.)
              </li>
              <li>
                <InlineCode>className?: string</InlineCode> - An (optional)
                string of class names to apply to the code block
              </li>
              <li>
                <InlineCode>theme?: string</InlineCode> - An (optional) theme to
                explicitly render as - if this is provided there will not be a
                fallback theme rendered.
              </li>
            </UnorderedList>
          </li>
          <li>
            <P>
              <InlineCode>MDXCode</InlineCode> - A server component meant for
              use with transformed MDX (e.g. pass directly via{" "}
              <InlineCode>useMDXComponents</InlineCode>)
            </P>
            <P>Props:</P>
            <UnorderedList>
              <li>
                <InlineCode>children: ReactElement</InlineCode> - A ReactElement
                representing the transformed <InlineCode>code</InlineCode>{" "}
                element from the MDX transform.
              </li>
              <li>
                <InlineCode>className?: string</InlineCode> - An (optional)
                string of class names to apply to the code block
              </li>
            </UnorderedList>
          </li>
        </UnorderedList>
        <P>
          Additionally, a <InlineCode>updateConfig</InlineCode> function is
          exported to update the configuration (light and dark themes, as well
          as CSS selectors to show the right theme) at runtime.
        </P>
        <CodeBlock lang="ts">{`import { updateConfig } from "kanapa";

// set the themes and selectors at runtime
updateConfig({
  themes: {
    dark: "vitesse-dark",
    light: "vitesse-light",
  },
  // 'system' will use a media query to match the user's OS theme
  selectors: "system",
  // otherwise you can provide an object of 'light' and 'dark' keys
  // specifying the selectors to match on, e.g.:
  selectors: {
    light: "html.light",
    dark: "html.dark",
  },
});`}</CodeBlock>
        <P>The default config is:</P>
        <CodeBlock lang="json">{`{
  themes: {
    dark: "vitesse-dark",
    light: "vitesse-light",
  },
  selectors: "system",
}`}</CodeBlock>
        <P>
          You can find the supported{" "}
          <Link href="https://github.com/shikijs/shiki/blob/main/docs/themes.md">
            themes here
          </Link>{" "}
          and{" "}
          <Link href="https://github.com/shikijs/shiki/blob/main/docs/languages.md">
            languages here
          </Link>
          .
        </P>
      </section>
      <section id="mdx" className={sectionClasses}>
        <H2>MDX Usage:</H2>
        <P>
          If you&apos;re working with MDX, you can use the{" "}
          <InlineCode>MDXCode</InlineCode> component to render code blocks.
          You&apos;ll want to configure the{" "}
          <InlineCode>rehype-mdx-code-props</InlineCode> rehype plugin to
          transform the code blocks, and then configure your MDX runtime to use
          the <InlineCode>MDXCode</InlineCode> component as the{" "}
          <InlineCode>&quot;pre&quot;</InlineCode> element.
        </P>
        <P>Here's an example of how to set this up with Next.js:</P>
        <CodeBlock
          lang="ts"
          code={`// in mdx-components.ts

export function useMDXComponents() {
  return {
    pre: MDXCode,
  };
}`}
        />
        <P>
          Then in your MDX you can use plain old markdown code blocks/fences:
        </P>
        <CodeBlock lang="md">{`some markdown here
With a code block inside:

\`\`\`tsx
function MyComponent() {
  return <div>Hello, world!</div>;
}
\`\`\``}</CodeBlock>
      </section>
      <footer className={sectionClasses}>
        <P>
          The source code for the library is available on{" "}
          <Link href="https://github.com/hamlim/kanapa">GitHub</Link>. If you
          run into any bugs, please report them via{" "}
          <Link href="https://github.com/hamlim/kanapa/issues/new">issues</Link>
          .
        </P>
        <P>
          If you&apos;d like to discuss changes to the project, feel free to
          start a{" "}
          <Link href="https://github.com/hamlim/kanapa/discussions/new/choose">
            discussion
          </Link>
          !
        </P>
      </footer>
    </main>
  );
}
