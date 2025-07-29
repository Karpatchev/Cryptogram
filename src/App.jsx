
import { useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";

import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";

import "@solana/wallet-adapter-react-ui/styles.css";

const SOLANA_RPC = "https://api.devnet.solana.com";
const RECIPIENT = new PublicKey("3hC4fUaa4VuK4dMpVDCodAfhH3UJKV8Kz1PxaK7PLe9c"); // замените на нужный адрес
const MEMO_TEXT = "Hello, World!";
const LAMPORTS = 1000; // 0.000001 SOL

function Sender() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [status, setStatus] = useState("");

  const sendMessage = async () => {
    if (!publicKey || !connected) return;

    const connection = new Connection(SOLANA_RPC);

    const memoIx = new TransactionInstruction({
      keys: [],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from(MEMO_TEXT, "utf-8"),
    });

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: RECIPIENT,
        lamports: LAMPORTS,
      }),
      memoIx
    );

    try {
      setStatus("Поднесите Tangem и подтвердите...");
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      setStatus("✅ Успешно отправлено! Транзакция: " + signature);
    } catch (err) {
      console.error(err);
      setStatus("❌ Ошибка: " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">📤 Отправка сообщения через Memo</h1>
      <WalletMultiButton className="mb-4" />
      <button
        onClick={sendMessage}
        disabled={!connected}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Отправить "Hello, World!"
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}

export default function App() {
  const endpoint = SOLANA_RPC;
  const wallets = [new WalletConnectWalletAdapter({ network: "devnet" })];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Sender />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
