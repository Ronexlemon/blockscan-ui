
export interface BlockEvent {
  block_number: number;
  total_txs: number;
  call_count: number;
  event_count: number;
}

export interface TransactionArgs {
  To: string;
  From?: string;
  Spender?: string;
  Amount: number;
}

export interface TransactionEvent {
  Method: string;
  TxHash: string;
  From: string;
  ContractAddr: string;
  TxType: number;
  Args: TransactionArgs;
}


