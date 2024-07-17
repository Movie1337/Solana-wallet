import { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import { FaSyncAlt } from "react-icons/fa";
import styles from "../styles/Transactions.module.css";

export default function Transactions() {
  const [wallet, setWallet] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    }
  }, []);

  const updateBalance = async () => {
    if (wallet) {
      setIsUpdating(true);
      const connection = new Connection(clusterApiUrl("devnet"));
      const publicKey = new PublicKey(wallet.publicKey);
      const balance = await connection.getBalance(publicKey);
      setWallet((prevWallet) => ({
        ...prevWallet,
        balance: balance / LAMPORTS_PER_SOL,
      }));
      localStorage.setItem(
        "wallet",
        JSON.stringify({
          ...wallet,
          balance: balance / LAMPORTS_PER_SOL,
        })
      );
      setIsUpdating(false);
    }
  };

  const sendTransaction = async () => {
    if (!wallet) {
      setMessage("No wallet found.");
      return;
    }
    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const fromKeypair = Keypair.fromSecretKey(
        new Uint8Array(wallet.privateKey)
      );

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await connection.sendTransaction(transaction, [
        fromKeypair,
      ]);
      await connection.confirmTransaction(signature, "confirmed");
      setMessage("Transaction successful: " + signature);

      const balance = await connection.getBalance(fromKeypair.publicKey);
      const updatedWallet = {
        ...wallet,
        balance: balance / LAMPORTS_PER_SOL,
      };
      setWallet(updatedWallet);
      localStorage.setItem("wallet", JSON.stringify(updatedWallet));
    } catch (error) {
      setMessage("Transaction failed: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => window.history.back()}
      >
        Back
      </button>
      <h1 className={styles.title}>Transactions</h1>
      {wallet && (
        <div className={styles.walletInfo}>
          <p>
            Balance: {wallet.balance} SOL{" "}
            <FaSyncAlt
              className={`${styles.updateIcon} ${
                isUpdating ? styles.spin : ""
              }`}
              onClick={updateBalance}
            />
          </p>
        </div>
      )}
      <input
        className={styles.input}
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        className={styles.input}
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className={styles.button} onClick={sendTransaction}>
        Send
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
