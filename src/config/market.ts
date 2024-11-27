export const MARKET_CONFIG = {
  LME: {
    PREMIUM_USD: 45, // Premium in USD/MT
    DUTY_FACTOR: 1.0825, // Duty factor (8.25%)
  },
  RBI: {
    DEFAULT_RATE: 84.4063,
    UPDATE_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  }
} as const;