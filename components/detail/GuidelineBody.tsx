import { MDXRemote } from "next-mdx-remote/rsc";

export function GuidelineBody({ source }: { source: string }) {
  return (
    <article className="prose-game">
      <MDXRemote source={source} />
    </article>
  );
}
