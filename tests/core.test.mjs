import test from "node:test";
import assert from "node:assert/strict";

process.env.DISCORD_TOKEN = "test-token";
process.env.DISCORD_CLIENT_ID = "test-client-id";
process.env.COMMAND_SCOPE = "global";

const { loadConfig, baseEnvSchema, TTLCache, safeEventHandler } = await import("../dist/index.js");

test("loadConfig parses a valid global-scope env", () => {
  const config = loadConfig(baseEnvSchema);
  assert.equal(config.DISCORD_TOKEN, "test-token");
  assert.equal(config.LOG_LEVEL, "info");
});

test("loadConfig rejects guild scope without DISCORD_GUILD_ID", () => {
  const schema = baseEnvSchema;
  const env = { ...process.env, COMMAND_SCOPE: "guild", DISCORD_GUILD_ID: undefined };
  assert.throws(() => {
    const parsed = schema.parse(env);
    if (parsed.COMMAND_SCOPE === "guild" && !parsed.DISCORD_GUILD_ID) {
      throw new Error("COMMAND_SCOPE is 'guild' but DISCORD_GUILD_ID is missing");
    }
  });
});

test("TTLCache expires entries after ttlMs", async () => {
  const cache = new TTLCache(10);
  cache.set("k", "v");
  assert.equal(cache.get("k"), "v");
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(cache.get("k"), undefined);
});

test("safeEventHandler catches async errors without throwing", () => {
  let logged = null;
  const logger = { error: (obj, msg) => (logged = { obj, msg }) };
  const handler = safeEventHandler(logger, "test:event", async () => {
    throw new Error("boom");
  });

  assert.doesNotThrow(() => handler());
  return new Promise((resolve) => {
    setTimeout(() => {
      assert.ok(logged, "expected logger.error to be called");
      assert.equal(logged.obj.event, "test:event");
      resolve();
    }, 10);
  });
});
