import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Keypair, Connection, PublicKey, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import fs from "fs";

const SEED_CONFIG = "config";
const GAME_GROUND = "BONDING_CURVE";
const GLOBAL = "global";

async function main() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // Load all wallets
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

    console.log("🎰 CASINO GAME TEST");
    console.log("=".repeat(50));
    console.log("Admin:", adminKeypair.publicKey.toBase58());
    console.log("FeePayer:", feePayerKeypair.publicKey.toBase58());
    console.log("Player1:", player1Keypair.publicKey.toBase58());
    console.log("Player2:", player2Keypair.publicKey.toBase58());
    
    // Setup provider with feePayer as the wallet (since it pays for txs)
    const feePayerWallet = new NodeWallet(feePayerKeypair);
    anchor.setProvider(new anchor.AnchorProvider(connection, feePayerWallet, {
        skipPreflight: true,
        commitment: "confirmed",
    }));

    const idl = JSON.parse(fs.readFileSync("./idl/jackpot_smart_contract.json", "utf-8"));
    const programId = new PublicKey("asADxxCjUt4JGRCwM3ohmMJ6cUgCm4DqVNTRyvo17zg");
    const program = new Program(idl, anchor.getProvider()) as any;

    // PDAs
    const [configPda] = PublicKey.findProgramAddressSync([Buffer.from(SEED_CONFIG)], programId);
    const [globalVaultPda] = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL)], programId);
    
    // Fetch config
    const config = await program.account.config.fetch(configPda);
    console.log("\n📋 Casino Config:");
    console.log("  Game Round:", config.gameRound.toNumber());
    console.log("  Platform Fee:", config.platformFee.toNumber() / 100, "%");
    console.log("  Team Wallet:", config.teamWallet.toBase58());
    console.log("  Payer Wallet:", config.payerWallet.toBase58());
    
    const roundNum = 0; // Games are 0-indexed (first game is round 0)
    const [gameGroundPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(GAME_GROUND), new BN(roundNum).toArrayLike(Buffer, "le", 8)],
        programId
    );
    
    console.log("\n🎮 Game Ground PDA:", gameGroundPda.toBase58());
    
    try {
        const gameGround = await program.account.gameGround.fetch(gameGroundPda);
        console.log("  Creator:", gameGround.creator.toBase58());
        console.log("  Round Time:", gameGround.roundTime.toNumber(), "seconds");
        console.log("  Min Deposit:", gameGround.minDepositAmount.toNumber() / LAMPORTS_PER_SOL, "SOL");
        console.log("  Total Deposit:", gameGround.totalDeposit.toNumber() / LAMPORTS_PER_SOL, "SOL");
        console.log("  User Count:", gameGround.userCount.toNumber());
        console.log("  Is Completed:", gameGround.isCompleted);
    } catch (e) {
        console.log("  Game not found or error:", (e as Error).message);
    }

    // Check balances
    console.log("\n💰 Balances:");
    console.log("  Player1:", (await connection.getBalance(player1Keypair.publicKey)) / LAMPORTS_PER_SOL, "SOL");
    console.log("  Player2:", (await connection.getBalance(player2Keypair.publicKey)) / LAMPORTS_PER_SOL, "SOL");
    console.log("  FeePayer:", (await connection.getBalance(feePayerKeypair.publicKey)) / LAMPORTS_PER_SOL, "SOL");
    console.log("  Global Vault:", (await connection.getBalance(globalVaultPda)) / LAMPORTS_PER_SOL, "SOL");

    // Try to join game
    console.log("\n🎲 Player 1 joining game with 0.1 SOL...");
    
    const betAmount = new BN(100_000_000); // 0.1 SOL
    
    try {
        const tx = await program.methods
            .joinGame(new BN(roundNum), betAmount)
            .accounts({
                joiner: player1Keypair.publicKey,
                payer: feePayerKeypair.publicKey,
                teamWallet: config.teamWallet,
            })
            .signers([player1Keypair, feePayerKeypair])
            .rpc();
        
        console.log("  ✅ Player 1 joined! TX:", tx);
    } catch (e: any) {
        console.log("  ❌ Error:", e.message);
        if (e.logs) {
            console.log("  Logs:", e.logs.slice(-5));
        }
    }

    // Check game state again
    try {
        const gameGround = await program.account.gameGround.fetch(gameGroundPda);
        console.log("\n📊 Game State After Join:");
        console.log("  Total Deposit:", gameGround.totalDeposit.toNumber() / LAMPORTS_PER_SOL, "SOL");
        console.log("  User Count:", gameGround.userCount.toNumber());
        console.log("  Deposit List:", gameGround.depositList);
    } catch (e) {
        console.log("Could not fetch game state");
    }
}

main().catch(console.error);
