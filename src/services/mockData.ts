export const mockLMEHistory = [
  {
    date: "14. November 2024",
    price: 2639.50,
    change: -16.00
  },
  {
    date: "13. November 2024",
    price: 2655.50,
    change: -25.00
  },
  {
    date: "12. November 2024",
    price: 2680.50,
    change: -35.00
  },
  {
    date: "11. November 2024",
    price: 2715.50,
    change: -45.50
  }
].map(item => ({
  date: String(item.date),
  price: Number(item.price),
  change: Number(item.change)
}));