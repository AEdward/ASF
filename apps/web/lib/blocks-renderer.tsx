interface TextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface LinkNode {
  type: "link";
  url: string;
  children: InlineNode[];
}

type InlineNode = TextNode | LinkNode;

interface BlockNode {
  type: string;
  level?: number;
  format?: "ordered" | "unordered";
  children?: unknown[];
}

function renderInline(node: InlineNode, key: number): React.ReactNode {
  if (node.type === "link") {
    return (
      <a
        key={key}
        href={node.url}
        className="underline text-green-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        {node.children.map((child, i) => renderInline(child, i))}
      </a>
    );
  }
  let content: React.ReactNode = node.text;
  if (node.code) content = <code>{content}</code>;
  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  return <span key={key}>{content}</span>;
}

const HEADING_CLASS: Record<number, string> = {
  1: "mt-8 text-4xl font-black",
  2: "mt-8 text-3xl font-black",
  3: "mt-6 text-2xl font-bold",
  4: "mt-6 text-xl font-bold",
  5: "mt-4 text-lg font-bold",
  6: "mt-4 text-base font-bold",
};

function renderBlock(node: BlockNode, key: number): React.ReactNode {
  const children = (node.children ?? []) as InlineNode[];
  switch (node.type) {
    case "heading": {
      const level = node.level ?? 2;
      const Tag = `h${level}` as React.ElementType;
      return (
        <Tag key={key} className={HEADING_CLASS[level] ?? HEADING_CLASS[2]}>
          {children.map((c, i) => renderInline(c, i))}
        </Tag>
      );
    }
    case "list": {
      const ListTag = node.format === "ordered" ? "ol" : "ul";
      const listClass = node.format === "ordered" ? "list-decimal" : "list-disc";
      return (
        <ListTag key={key} className={`mt-4 ml-6 space-y-1 ${listClass} text-slate-600`}>
          {((node.children ?? []) as BlockNode[]).map((item, i) => (
            <li key={i}>
              {((item.children ?? []) as InlineNode[]).map((c, j) => renderInline(c, j))}
            </li>
          ))}
        </ListTag>
      );
    }
    case "quote":
      return (
        <blockquote key={key} className="mt-6 border-l-4 border-green-600 pl-5 italic text-slate-600">
          {children.map((c, i) => renderInline(c, i))}
        </blockquote>
      );
    case "code":
      return (
        <pre key={key} className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-white">
          <code>{children.map((c) => (c as TextNode).text ?? "").join("")}</code>
        </pre>
      );
    case "paragraph":
    default:
      return (
        <p key={key} className="mt-4 leading-7 text-slate-600">
          {children.map((c, i) => renderInline(c, i))}
        </p>
      );
  }
}

export function renderRichText(blocks: unknown[]): React.ReactNode {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((raw, index) => renderBlock(raw as BlockNode, index));
}
