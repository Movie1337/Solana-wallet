import { useState, useEffect } from "react";
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";
import { FaSyncAlt } from "react-icons/fa";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    }
  }, []);

  useEffect(() => {
    if (wallet) {
      updateBalance();
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

  const createWallet = async () => {
    const keypair = Keypair.generate();
    const connection = new Connection(clusterApiUrl("devnet"));
    const balance = await connection.getBalance(keypair.publicKey);
    const newWallet = {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Array.from(keypair.secretKey),
      balance: balance / LAMPORTS_PER_SOL,
    };
    setWallet(newWallet);
    localStorage.setItem("wallet", JSON.stringify(newWallet));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Solana Wallet</h1>
      {!wallet && (
        <button className={styles.button} onClick={createWallet}>
          Create Wallet
        </button>
      )}
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
          <p>
            Address:
            <span
              className={styles.copyable}
              onClick={() => copyToClipboard(wallet.publicKey)}
            >
              {wallet.publicKey}
            </span>
          </p>
          <p>
            Private Key:
            <span
              className={styles.copyable}
              onClick={() => copyToClipboard(wallet.privateKey)}
            >
              {wallet.privateKey}
            </span>
          </p>
        </div>
      )}
      {wallet && (
        <a href="/transactions" className={styles.transactionsLink}>
          Go to Transactions
        </a>
      )}
    </div>
  );
}
