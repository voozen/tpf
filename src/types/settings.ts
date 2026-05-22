export type UserSettings = {
  currency: string;
  budgetStartDay: number;
  notifications: {
    debts: boolean;
    budget: boolean;
    weekly: boolean;
  };
  biometric: boolean;
};
