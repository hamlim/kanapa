import { Code, config } from "kanapa";

export default async function Home() {
  return (
    <main>
      <Code
        lang="tsx"
        code={`import {use} from 'react';

let thing = Promise.resolve(42);

export function useThing() {
  return use(thing)
}`}
      />
    </main>
  );
}
