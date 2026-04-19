function shortAddr(addr: string) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function shortHash(hash: string) {
  if (!hash) return "—";
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

export {shortAddr,shortHash}