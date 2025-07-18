import { $ } from "bun";
import { describe, it, expect } from "bun:test";

describe("Bun", async () => {
	it("should be available", async () => {
		// Execute the command to get the Bun version
		const output = await $`bun --version`; //.toString().trim();
		const version = output.text().trim();

		// Assert that the version matches the expected format
		expect(version).toMatch(/^\d+\.\d+\.\d+/);
		console.log("Bun is available:", version);
	});
});
