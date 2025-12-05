import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import { Keypair, Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import fs from "fs";

const SEED_CONFIG = "config";
const GLOBAL = "global";

async function main() {
    console.log("\n🎰 SOLANA CASINO - LOCAL TEST\n");
    console.log("=".repeat(50));

    // Setup connection
    const connection = new Connection("http://localhost:8899", "confirmed");
    
    // Load wallets
    const adminKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync("./keys/admin.json", "utf-8")))
    );
    const feePayerKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync("./keys/feePayer.json", "utf-8")))
    );
    const player1Keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync("./keys/player1.json", "utf-8")))
    );
    const player2Keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync("./keys/player2.json", "utf-8")))
    );

    console.log("👤 Admin:", adminKeypair.publicKey.toBase58());
    console.log("💰 FeePayer:", feePayerKeypair.publicKey.toBase58());
    console.log("🎮 Player1:", player1Keypair.publicKey.toBase58());
    console.log("🎮 Player2:", player2Keypair.publicKey.toBase58());
    
    // Setup provider
    const adminWallet = new NodeWallet(adminKeypair);
    anchor.setProvider(new anchor.AnchorProvider(connection, adminWallet, {
        skipPreflight: true,
        commitment: "confirmed",
    }));

    // Load program from IDL
    const idl = JSON.parse(fs.readFileSync("./idl/jackpot_smart_contract.json", "utf-8"));
    const programId = new PublicKey("asADxxCjUt4JGRCwM3ohmMJ6cUgCm4DqVNTRyvo17zg");
    const program = new Program(idl, anchor.getProvider()) as any;

    // Derive PDAs
    const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED_CONFIG)],
        programId
    );
    const [globalVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL)],
        programId
    );

    console.log("\n📋 PDAs:");
    console.log("  Config PDA:", configPda.toBase58());
    console.log("  Global Vault:", globalVaultPda.toBase58());

    // Check balances
    console.log("\n💵 Balances:");
    const adminBal = await connection.getBalance(adminKeypair.publicKey);
    const player1Bal = await connection.getBalance(player1Keypair.publicKey);
    const player2Bal = await connection.getBalance(player2Keypair.publicKey);
    console.log("  Admin:", adminBal / LAMPORTS_PER_SOL, "SOL");
    console.log("  Player1:", player1Bal / LAMPORTS_PER_SOL, "SOL");
    console.log("  Player2:", player2Bal / LAMPORTS_PER_SOL, "SOL");

    // Configure the casino
    console.log("\n🔧 Configuring casino...");
    try {
        const configData = {
            authority: adminKeypair.publicKey,
            payerWallet: feePayerKeypair.publicKey,
            teamWallet: adminKeypair.publicKey,
            gameRound: new BN(0),
            platformFee: new BN(100), // 1%
            minDepositAmount: new BN(100_000_000), // 0.1 SOL
            maxJoinerCount: new BN(100),
            initialized: true,
        };

        const tx = await program.methods
            .configure(configData)
            .accounts({
                payer: adminKeypair.publicKey,
            })
            .signers([adminKeypair])
            .rpc();

        console.log("  ✅ Config TX:", tx);

        // Fetch config to verify
        const config = await program.account.config.fetch(configPda);
        console.log("\n📊 Casino Config:");
        console.log("  Authority:", config.authority.toBase58());
        console.log("  Platform Fee:", config.platformFee.toNumber() / 100, "%");
        console.log("  Min Deposit:", config.minDepositAmount.toNumber() / LAMPORTS_PER_SOL, "SOL");
        console.log("  Max Players:", config.maxJoinerCount.toNumber());
        console.log("  Game Round:", config.gameRound.toNumber());
    } catch (e: any) {
        if (e.message?.includes("already in use")) {
            console.log("  ℹ️  Config already exists, fetching...");
            const config = await program.account.config.fetch(configPda);
            console.log("\n📊 Existing Casino Config:");
            console.log("  Authority:", config.authority.toBase58());
            console.log("  Platform Fee:", config.platformFee.toNumber() / 100, "%");
            console.log("  Min Deposit:", config.minDepositAmount.toNumber() / LAMPORTS_PER_SOL, "SOL");
            console.log("  Max Players:", config.maxJoinerCount.toNumber());
            console.log("  Game Round:", config.gameRound.toNumber());
        } else {
            console.log("  ❌ Error:", e.message);
        }
    }

    console.log("\n" + "=".repeat(50));
    console.log("⚠️  NOTE: Full game flow (create_game, join_game, set_winner)");
    console.log("    requires ORAO VRF which is only available on devnet/mainnet.");
    console.log("    The contract is deployed and config is set!");
    console.log("=".repeat(50));

    // Show global vault balance
    const vaultBal = await connection.getBalance(globalVaultPda);
    console.log("\n🏦 Global Vault Balance:", vaultBal / LAMPORTS_PER_SOL, "SOL");

    console.log("\n✅ Casino contract is ready!");
    console.log("   To test full flow, deploy to devnet with ORAO VRF.\n");
}

main().catch(console.error);
