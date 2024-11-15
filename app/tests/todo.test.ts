import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { TodoClient } from "../src/client";
import { expect } from "chai";
import "mocha";

describe("Todo Program", function () {
	this.timeout(10000);
	// Initialize the connection to devnet
	const connection = new Connection(
		"https://api.devnet.solana.com",
		"confirmed"
	);

	// Generate a new keypair for testing
	const payer = Keypair.generate();

	// Your program ID (replace with actual program ID after deployment)
	const programId = new PublicKey(
		"H1V7y7UgVdFovs7gdbCo4KtsH95LYAiE46Yz1Wvki6fa"
	);

	// Initialize the client
	const todoClient = new TodoClient(connection, programId);

	before(async () => {
		// Airdrop some SOL to the payer account for testing
		const signature = await connection.requestAirdrop(
			payer.publicKey,
			1000000000 // 1 SOL
		);
		await connection.confirmTransaction(signature);
	});

	it("should add a new task", async (done) => {
		try {
			const signature = await todoClient.addTask(payer, "Test Task 1");
			expect(signature).to.be.a("string");
      done();
		} catch (err) {
			throw err;
		}
	});

	it("should toggle a task", async (done) => {
		try {
			const signature = await todoClient.toggleTask(payer, 1);
			expect(signature).to.be.a("string");
      done();
		} catch (err) {
			throw err;
		}
	});

	it("should delete a task", async (done) => {
		try {
			const signature = await todoClient.deleteTask(payer, 1);
			expect(signature).to.be.a("string");
      done();
		} catch (err) {
			throw err;
		}
	});
});
