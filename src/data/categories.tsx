export interface Categories {
  id: string;
  name: string;
  type: string;
  color:string;
  icon:string
}
export const defaultCategories = [
  // Income Categories
  {
    id: "salary",
    name: "Salary",
    type: "credit",
    color: "#22c55e", // green-500
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "credit",
    color: "#06b6d4", // cyan-500
    icon: "Laptop",
  },
  {
    id: "investments",
    name: "Investments",
    type: "credit",
    color: "#6366f1", // indigo-500
    icon: "TrendingUp",
  },
  {
    id: "business",
    name: "Business",
    type: "credit",
    color: "#ec4899", // pink-500
    icon: "Building",
  },
  {
    id: "rental",
    name: "Rental",
    type: "credit",
    color: "#f59e0b", // amber-500
    icon: "Home",
  },
  {
    id: "other-income",
    name: "Other Income",
    type: "credit",
    color: "#64748b", // slate-500
    icon: "Plus",
  },

  // Expense Categories
  {
    id: "housing",
    name: "Housing",
    type: "debit",
    color: "#ef4444", // red-500
    icon: "Home",
    subcategories: ["Rent", "Mortgage", "Property Tax", "Maintenance"],
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "debit",
    color: "#f97316", // orange-500
    icon: "Car",
    subcategories: ["Fuel", "Public Transport", "Maintenance", "Parking"],
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "debit",
    color: "#84cc16", // lime-500
    icon: "Shopping",
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "debit",
    color: "#06b6d4", // cyan-500
    icon: "Zap",
    subcategories: ["Electricity", "Water", "Gas", "Internet", "Phone"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "debit",
    color: "#8b5cf6", // violet-500
    icon: "Film",
    subcategories: ["Movies", "Games", "Streaming Services"],
  },
  {
    id: "food",
    name: "Food",
    type: "debit",
    color: "#f43f5e", // rose-500
    icon: "UtensilsCrossed",
  },
  {
    id: "shopping",
    name: "Shopping",
    type: "debit",
    color: "#ec4899", // pink-500
    icon: "ShoppingBag",
    subcategories: ["Clothing", "Electronics", "Home Goods"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    type: "debit",
    color: "#14b8a6", // teal-500
    icon: "HeartPulse",
    subcategories: ["Medical", "Dental", "Pharmacy", "Insurance"],
  },
  {
    id: "education",
    name: "Education",
    type: "debit",
    color: "#6366f1", // indigo-500
    icon: "GraduationCap",
    subcategories: ["Tuition", "Books", "Courses"],
  },
  {
    id: "personal",
    name: "Personal Care",
    type: "debit",
    color: "#d946ef", // fuchsia-500
    icon: "Smile",
    subcategories: ["Haircut", "Gym", "Beauty"],
  },
  {
    id: "travel",
    name: "Travel",
    type: "debit",
    color: "#0ea5e9", // sky-500
    icon: "Plane",
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "debit",
    color: "#64748b", // slate-500
    icon: "Shield",
    subcategories: ["Life", "Home", "Vehicle"],
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    type: "debit",
    color: "#f472b6", // pink-400
    icon: "Gift",
  },
  {
    id: "bills",
    name: "Bills & Fees",
    type: "debit",
    color: "#fb7185", // rose-400
    icon: "Receipt",
    subcategories: ["Bank Fees", "Late Fees", "Service Charges"],
  },
  {
    id: "other-expense",
    name: "Other Expenses",
    type: "debit",
    color: "#94a3b8", // slate-400
    icon: "MoreHorizontal",
  },
];

export const categoryColors = defaultCategories.reduce<Record<string, string>>((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});