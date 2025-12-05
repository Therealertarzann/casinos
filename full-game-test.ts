import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import fs from "fs";
import { joinGameTx } from "./lib/scripts";

const SEED_CONFIG = "config";
const GAME_GROUND = "BONDING_CURVE";
const GLOBAL = "global";

async function main() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

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

    console.log("\n🎰 SOLANA CASINO - DEVNET DEMO");
    console.log("=".repeat(50));

    // Setup provider
    const adminWallet = new NodeWallet(adminKeypair);
    anchor.setProvider(new anchor.AnchorProvider(connection, adminWallet, {
        skipPreflight: true,
        commitment: "confirmed",
    }));

    const idl = JSON.parse(fs.readFileSync("./target/idl/jackpot_smart_contract.json", "utf-8"));
    const programId = new PublicKey("asADxxCjUt4JGRCwM3ohmMJ6cUgCm4DqVNTRyvo17zg");
    const program = new Program(idl, anchor.getProvider()) as any;

    // PDAs
    const [configPda] = PublicKey.findProgramAddressSync([Buffer.from(SEED_CONFIG)], programId);
    const [globalVaultPda] = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL)], programId);

    // Fetch config
    const config = await program.account.config.fetch(configPda);
    console.log("\n📋 Casino Configuration:");
    console.log("  Authority:", config.authority.toBase58());
    console.log("  Platform Fee:", config.platformFee.toNumber() / 100, "%");
    console.log("  Min Deposit:", config.minDepositAmount.toNumber() / LAMPORTS_PER_SOL, "SOL");
    console.log("  Max Players:", config.maxJoinerCount.toNumber());
    console.log("  Current Round:", config.gameRound.toNumber());

    // Game info - round 0 (first game)
    const roundNum = 0;
    const [gameGroundPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(GAME_GROUND), new BN(roundNum).toArrayLike(Buffer, "le", 8)],
        programId
    );

    let gameGround = await program.account.gameGround.fetch(gameGroundPda);
    console.log("\n🎮 Game Round 0:");
    console.log("  Game PDA:", gameGroundPda.toBase58());
    console.log("  Round Time:", gameGround.roundTime.toNumber(), "seconds");
    console.log("  Min Bet:", gameGround.minDepositAmount.toNumber() / LAMPORTS_PER_SOL, "SOL");
    console.log("  Total Pot:", gameGround.totalDeposit.toNumber() / LAMPORTS_PER_SOL, "SOL");
    console.log("  Players:", gameGround.userCount.toNumber());
    console.log("  Completed:", gameGround.isCompleted);

    // Balances
    console.log("\n💰 Player Balances:");
    console.log("  Player1:", (await connection.getBalance(player1Keypair.publicKey)) / LAMPORTS_PER_SOL, "SOL");
    console.log("  Player2:", (await connection.getBalance(player2Keypair.publicKey)) / LAMPORTS_PER_SOL, "SOL");
    console.log("  Global Vault:", (await connection.getBalance(globalVaultPda)) / LAMPORTS_PER_SOL, "SOL");

    // Join game using the lib function
    console.log("\n🎲 Player 1 placing bet of 0.1 SOL...");

    try {
        const tx = await joinGameTx(
            player1Keypair.publicKey,
            feePayerKeypair,
            config.teamWallet,
            roundNum,
            100000000, // 0.1 SOL
            connection,
            program
        );

        tx.sign(player1Keypair);
        const sig = await sendAndConfirmTransaction(connection, tx, [player1Keypair, feePayerKeypair]);
        console.log("  ✅ Player 1 joined! TX:", sig);
    } catch (e: any) {
        console.log("  ❌ Error:", e.message);
    }

    // Player 2 joins
    console.log("\n🎲 Player 2 placing bet of 0.1 SOL...");
    try {
        const tx = await joinGameTx(
            player2Keypair.publicKey,
            feePayerKeypair,
            config.teamWallet,
            roundNum,
            100000000, // 0.1 SOL
            connection,
            program
        );

        tx.sign(player2Keypair);
        const sig = await sendAndConfirmTransaction(connection, tx, [player2Keypair, feePayerKeypair]);
        console.log("  ✅ Player 2 joined! TX:", sig);
    } catch (e: any) {
        console.log("  ❌ Error:", e.message);
    }

    // Check final state
    gameGround = await program.account.gameGround.fetch(gameGroundPda);
    console.log("\n📊 Game State After Bets:");
    console.log("  Total Pot:", gameGround.totalDeposit.toNumber() / LAMPORTS_PER_SOL, "SOL");
    console.log("  Players:", gameGround.userCount.toNumber());
    console.log("  Start Time:", gameGround.startDate.toNumber() > 0 ? new Date(gameGround.startDate.toNumber() * 1000).toISOString() : "Not started");
    console.log("  End Time:", gameGround.endDate.toNumber() > 0 ? new Date(gameGround.endDate.toNumber() * 1000).toISOString() : "Not started");

    if (gameGround.depositList.length > 0) {
        console.log("\n👥 Deposit List:");
        for (const dep of gameGround.depositList) {
            const userKey = dep.user.toBase58();
            const amt = dep.amount.toNumber() / LAMPORTS_PER_SOL;
            console.log("    " + userKey + ": " + amt + " SOL");
        }
    }

    console.log("\n💰 Updated Balances:");
    console.log("  Player1:", (await connection.getBalance(player1Keypair.publicKey)) / LAMPORTS_PER_SOL, "SOL");
    console.log("  Player2:", (await connection.getBalance(player2Keypair.publicKey)) / LAMPORTS_PER_SOL, "SOL");
    console.log("  Global Vault:", (await connection.getBalance(globalVaultPda)) / LAMPORTS_PER_SOL, "SOL");
    console.log("  Team Wallet:", (await connection.getBalance(config.teamWallet)) / LAMPORTS_PER_SOL, "SOL");

    console.log("\n" + "=".repeat(50));
    console.log("🎰 CASINO DEMO COMPLETE!");
    console.log("=".repeat(50));
    console.log("\nThe game is now active with players.");
    console.log("After the round ends (60 seconds), the winner can be set using VRF.");
    console.log("\nTo select winner after round ends:");
    console.log("  npm run script -- winner -g 0 -e devnet -k ./keys/admin.json");
}

main().catch(console.error);
