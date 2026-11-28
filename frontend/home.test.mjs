import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("converter submits media and presents a downloadable sticker", () => {
  const source = readFileSync(join(process.cwd(), "src/components/converter-card.tsx"), "utf8");
  assert.match(source, /api\/conversions\//);
  assert.match(source, /body\.set\("file", file\)/);
  assert.match(source, /body\.set\("url", url\.trim\(\)\)/);
  assert.match(source, /download="whatsapp-sticker\.webp"/);
  assert.match(source, /Making your animated sticker/);
  assert.match(source, /100 \* 1024 \* 1024/);
});
