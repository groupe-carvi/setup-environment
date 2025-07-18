import { exec } from "node:child_process";
import { promisify } from "node:util";
import assert from "node:assert";

const execAsync = promisify(exec);

describe("Node.js", async () => {
	it("should be available", async () => {
		try {
			// Execute the command to get the Node.js version
			const { stdout } = await execAsync("node --version");
			const version = stdout.trim();

			// Assert that the version matches the expected format
			assert.match(
				version,
				/^v\d+\.\d+\.\d+/,
				"Node.js is not available or version format is incorrect"
			);

			// console.log("Node.js is available:", version);
		} catch (error) {
			throw new Error("Node.js is not available");
		}
	});
});
