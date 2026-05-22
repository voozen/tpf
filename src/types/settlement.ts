export type Transfer = {
  id: string;
  from: string;
  to: string;
  amount: number;
  paid: boolean;
};

export type GroupSettlement = {
  transfers: Transfer[];
  rawDebts: Transfer[];
};
