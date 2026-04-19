"use client";

import { useEffect, useState, useRef } from "react";
import { copy } from "./utils/copy";
import { Row } from "./helpers/row";
import { shortAddr, shortHash } from "./utils/hash";
import { txTypeLabel } from "./utils/txType";
import { formatAmount } from "./utils/amountConversion";
import { BlockEvent, TransactionEvent } from "./types/types";
import { MAX_ITEMS, SSE_URL } from "./constant/constant";







function methodBadge(method: string) {
  switch (method) {
    case "transfer":     return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "transferFrom": return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "approve":      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "mint":         return "bg-green-500/10 text-green-400 border border-green-500/20";
    default:             return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
  }
}



export default function Home() {
  const [blocks, setBlocks]             = useState<BlockEvent[]>([]);
  const [transactions, setTransactions] = useState<TransactionEvent[]>([]);
  const [connected, setConnected]       = useState(false);
  const [status, setStatus]             = useState("Connecting...");
  const blocksRef = useRef<HTMLDivElement>(null);
  const txRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const es = new EventSource(SSE_URL);

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);

        if (msg.type === "connected") {
          setConnected(true);
          setStatus("Live");
          return;
        }

        if (msg.type === "block") {
          setBlocks((prev) => [msg.data as BlockEvent, ...prev].slice(0, MAX_ITEMS));
        }

        if (msg.type === "transaction") {
          setTransactions((prev) => [msg.data as TransactionEvent, ...prev].slice(0, MAX_ITEMS));
        }
      } catch {}
    };

    es.onerror = () => {
      setConnected(false);
      setStatus("Reconnecting...");
    };

    return () => es.close();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono flex flex-col">

      {/* ── Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
            BS
          </div>
          <span className="text-sm font-semibold tracking-widest uppercase text-zinc-300">
            BlockScan
          </span>
          <span className="text-zinc-600 text-xs">/ live</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-400 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className={`text-xs ${connected ? "text-green-400" : "text-red-400"}`}>
            {status}
          </span>
        </div>
      </header>

      {/* ── Stats bar */}
      <div className="border-b border-zinc-800 px-6 py-2.5 flex gap-8 text-xs text-zinc-500 shrink-0">
        <span>
          Blocks: <span className="text-zinc-200">{blocks.length}</span>
        </span>
        <span>
          Transactions: <span className="text-zinc-200">{transactions.length}</span>
        </span>
        {blocks[0] && (
          <span>
            Latest block:{" "}
            <span className="text-blue-400">#{blocks[0].block_number}</span>
          </span>
        )}
      </div>

      {/* ── Two columns */}
      <div className="grid grid-cols-2 flex-1 overflow-hidden">

        {/* ── Left — Blocks */}
        <div className="border-r border-zinc-800 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Blocks
            </span>
            <span className="text-xs text-zinc-600">
              {blocks.length} / {MAX_ITEMS}
            </span>
          </div>

          <div ref={blocksRef} className="flex-1 overflow-y-auto">
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-zinc-600 text-xs">
                Waiting for blocks...
              </div>
            ) : (
              blocks.map((block, i) => (
                <div
                  key={block.block_number}
                  className={`px-5 py-4 border-b border-zinc-800/60 hover:bg-zinc-900 transition-colors ${
                    i === 0 ? "bg-zinc-900/60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-400 text-sm font-semibold">
                      #{block.block_number}
                    </span>
                    {i === 0 && (
                      <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                        latest
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-zinc-200 text-sm font-semibold">
                        {block.total_txs}
                      </div>
                      <div className="text-zinc-600 mt-0.5">total txs</div>
                    </div>
                    <div>
                      <div className="text-zinc-200 text-sm font-semibold">
                        {block.call_count}
                      </div>
                      <div className="text-zinc-600 mt-0.5">calls</div>
                    </div>
                    <div>
                      <div className="text-zinc-200 text-sm font-semibold">
                        {block.event_count}
                      </div>
                      <div className="text-zinc-600 mt-0.5">events</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Right — Transactions */}
        <div className="flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Transactions
            </span>
            <span className="text-xs text-zinc-600">
              {transactions.length} / {MAX_ITEMS}
            </span>
          </div>

          <div ref={txRef} className="flex-1 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-zinc-600 text-xs">
                Waiting for transactions...
              </div>
            ) : (
              transactions.map((tx, i) => (
                <div
                  key={`${tx.TxHash}-${i}`}
                  className={`px-5 py-4 border-b border-zinc-800/60 hover:bg-zinc-900 transition-colors ${
                    i === 0 ? "bg-zinc-900/60" : ""
                  }`}
                >
                  {/* Method + short hash */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium ${methodBadge(tx.Method)}`}
                    >
                      {tx.Method}
                    </span>
                    <span
                      className="text-zinc-500 text-[11px] hover:text-zinc-300 cursor-pointer transition-colors"
                      title={tx.TxHash}
                      onClick={() => copy(tx.TxHash)}
                    >
                      {shortHash(tx.TxHash)}
                    </span>
                  </div>

                  {/* All fields */}
                  <div className="space-y-1.5 text-xs">

                    <Row
                      label="tx hash"
                      value={shortHash(tx.TxHash)}
                      color="text-zinc-400"
                      copyValue={tx.TxHash}
                    />

                    <Row
                      label="caller"
                      value={shortAddr(tx.From)}
                      color="text-zinc-300"
                      copyValue={tx.From}
                    />

                    <Row
                      label="contract"
                      value={shortAddr(tx.ContractAddr)}
                      color="text-blue-400"
                      copyValue={tx.ContractAddr}
                    />

                    {tx.Args?.To && (
                      <Row
                        label="to"
                        value={shortAddr(tx.Args.To)}
                        color="text-zinc-300"
                        copyValue={tx.Args.To}
                      />
                    )}

                    {tx.Args?.From && (
                      <Row
                        label="from"
                        value={shortAddr(tx.Args.From)}
                        color="text-zinc-300"
                        copyValue={tx.Args.From}
                      />
                    )}

                    {tx.Args?.Spender && (
                      <Row
                        label="spender"
                        value={shortAddr(tx.Args.Spender)}
                        color="text-amber-400"
                        copyValue={tx.Args.Spender}
                      />
                    )}

                    {tx.Args?.Amount !== undefined && tx.Args?.Amount !== null && (
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600 w-20 shrink-0">amount</span>
                        <span className="text-green-400 font-medium">
                          {formatAmount(tx.Args.Amount)}
                          {tx.Args.Amount > 1e15 && (
                            <span className="text-zinc-600 ml-1 text-[10px]">
                              tokens
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {tx.TxType !== undefined && (
                      <Row
                        label="tx type"
                        value={txTypeLabel(tx.TxType)}
                        color="text-zinc-500"
                      />
                    )}

                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}