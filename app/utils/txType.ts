function txTypeLabel(t: number) {
  switch (t) {
    case 0: return "legacy";
    case 1: return "eip-2930";
    case 2: return "eip-1559";
    case 3: return "blob";
    default: return `type-${t}`;
  }
}

export {txTypeLabel}