
import { useState } from "react";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const SendSolWithMemo = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [receiver, setReceiver] = useState("FXMFb79zupLWkUc19wb3UjzU6GvdekkVoqnSPUSMLPWq");
  const [amount, setAmount] = useState("0.000000001");
  const [memo, setMemo] = useState("Hello, World!");
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  const handleSend = async () => {
    if (!publicKey) return alert("Сначала подключите Phantom");

    const toPubkey = new PublicKey(receiver);
    const lamports = Math.floor(parseFloat(amount) * 1e9);
    const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey,
        lamports,
      }),
      {
        keys: [],
        programId: memoProgramId,
        data: Buffer.from(memo),
      }
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      alert("Успешно отправлено! Транзакция: " + signature);
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <WalletMultiButton />
      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Получатель"
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Сумма в SOL"
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Memo"
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button onClick={handleSend} style={{ padding: 10, width: "100%" }}>
          Отправить
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const wallets = [new PhantomWalletAdapter()];
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SendSolWithMemo />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
