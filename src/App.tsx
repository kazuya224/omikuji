import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import "./App.css";

type Result = {
  label: string;
  msg: string;
  rarity: "legend" | "rare" | "normal";
};

export default function App() {
  const omikuji = useMemo<Result[]>(
    () => [
      {
        label: "超大吉",
        msg: "今年の運は最強。なお、今日で8割使い切る。",
        rarity: "legend",
      },
      {
        label: "神吉",
        msg: "もはや運を使い切っている。今日は帰れ。",
        rarity: "legend",
      },
      {
        label: "バグ年",
        msg: "今年の確率設定がおかしい。もう一回引け。",
        rarity: "legend",
      },
      {
        label: "大吉",
        msg: "今年は調子に乗っていい年。責任は来年取れ。",
        rarity: "rare",
      },
      {
        label: "吉",
        msg: "今年のジャンケンは全てあなたが勝つ。たぶん。",
        rarity: "rare",
      },
      { label: "中吉", msg: "何も言えねぇ。おもんねぇ。", rarity: "rare" },
      {
        label: "吉",
        msg: "去年と同じ感じ。現状維持は後退。",
        rarity: "normal",
      },
      { label: "小吉", msg: "とても普通だ。期待するな。", rarity: "normal" },
      {
        label: "吉",
        msg: "静かに生きなさい。山に籠るも良し。",
        rarity: "normal",
      },
      {
        label: "凶",
        msg: "今年は寝てた方が良い。布団から出るな。",
        rarity: "normal",
      },
      { label: "大凶", msg: "コトシ、オワッタ。。。", rarity: "normal" },
    ],
    []
  );

  const [result, setResult] = useState<Result | null>(null);
  const [phase, setPhase] = useState<"idle" | "drawing" | "revealed">("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const themeClass = result ? `theme-${result.label}` : "theme-idle";

  const draw = async () => {
    if (phase === "drawing") return;

    setPhase("drawing");
    setShakeKey((k) => k + 1);

    // 抽選中の間（演出用）
    await new Promise((r) => setTimeout(r, 900));

    const i = Math.floor(Math.random() * omikuji.length);
    const picked = omikuji[i];
    setResult(picked);
    setPhase("revealed");

    // 紙吹雪：大吉だけ派手
    if (picked.rarity === "legend") {
      confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 } });
      setTimeout(
        () => confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } }),
        250
      );
    } else if (picked.rarity === "rare") {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.65 } });
    }
  };

  const reset = () => {
    setResult(null);
    setPhase("idle");
  };

  return (
    <div className={`page ${themeClass}`}>
      <header className="header">
        <h1 className="title">おみくじ</h1>
        <p className="subtitle">運勢を引いてみよう</p>
      </header>

      <motion.div
        key={shakeKey}
        className="box"
        animate={
          phase === "drawing" ? { rotate: [0, -2, 2, -2, 2, 0] } : { rotate: 0 }
        }
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="ticketFrame">
          <AnimatePresence mode="wait">
            {phase !== "revealed" ? (
              <motion.div
                key="placeholder"
                className="ticket"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="ticketLabel">ここに結果が出ます</div>
                <div className="ticketMsg">
                  {phase === "drawing"
                    ? "ガサゴソ…（抽選中）"
                    : "ボタンを押して引いてね"}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={result?.label}
                className="ticket revealed"
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="ticketLabel big">{result?.label}</div>
                <div className="ticketMsg">{result?.msg}</div>
                {/* <div className="badge">
                  {result?.rarity === "legend"
                    ? "LEGEND"
                    : result?.rarity === "rare"
                    ? "RARE"
                    : "NORMAL"}
                </div> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="actions">
        <button
          className="btn primary"
          onClick={draw}
          disabled={phase === "drawing"}
        >
          {phase === "drawing" ? "抽選中…" : "引く"}
        </button>
        <button
          className="btn ghost"
          onClick={reset}
          disabled={phase === "drawing" && !result}
        >
          リセット
        </button>
      </div>
    </div>
  );
}
