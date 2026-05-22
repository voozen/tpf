export type CategoryBudget = {
  name: string;
  budget: number;
  spent: number;
  trend: string;
};

export type BudgetConfig = {
  monthlyLimit: number;
  categories: CategoryBudget[];
};
