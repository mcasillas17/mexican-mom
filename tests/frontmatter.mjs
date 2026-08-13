import { parseDocument } from "yaml";

export function parseFrontmatter(text, source = "SKILL.md") {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) throw new Error(`${source}: missing YAML frontmatter`);

  const document = parseDocument(match[1], {
    prettyErrors: true,
    uniqueKeys: true,
  });

  if (document.errors.length) {
    throw new Error(`${source}: ${document.errors.map((error) => error.message).join("; ")}`);
  }

  const fields = document.toJS();
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new Error(`${source}: frontmatter must be a YAML mapping`);
  }

  return fields;
}
