import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { EDITOR_CONFIGS } from "@/components/editor/configs";

const SLUGS = [
  "birthday-candles-interactive",
  "wedding-glass-interactive",
  "holiday-rosh-hashanah-interactive",
  "holiday-passover-interactive",
  "holiday-purim-interactive",
  "holiday-shavuot-interactive",
  "holiday-sukkot-interactive",
  "holiday-hanukkah-interactive",
] as const;

describe("interactive event template integration", () => {
  it("maps every new slug to an editor config and renderer", () => {
    const registry = readFileSync(
      join(process.cwd(), "src/components/templates/registry.ts"),
      "utf8",
    );

    for (const slug of SLUGS) {
      expect(EDITOR_CONFIGS[slug]).toBeDefined();
      const componentKey = slug.split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
      expect(registry).toContain(componentKey);
    }
  });

  it("keeps birthday age constrained in editor config", () => {
    const field = EDITOR_CONFIGS["birthday-candles-interactive"].fields
      .find((item) => item.key === "recipientAge");
    expect(field).toMatchObject({ type: "number", min: 1, max: 120 });
  });

  it("keeps wedding fields compact and omits signature", () => {
    const fields = EDITOR_CONFIGS["wedding-glass-interactive"].fields;
    expect(fields.find((item) => item.key === "signature")).toBeUndefined();
    expect(fields.find((item) => item.key === "coupleNames"))
      .toMatchObject({ maxLength: 42 });
    expect(fields.find((item) => item.key === "message"))
      .toMatchObject({ maxLength: 260 });
  });
});
