export const sortOptions = {
  NAME_ASC: { label: 'Name (A to Z)', value: 'az' },
  NAME_DESC: { label: 'Name (Z to A)', value: 'za' },
  PRICE_LOW_TO_HIGH: { label: 'Price (low to high)', value: 'lohi' },
  PRICE_HIGH_TO_LOW: { label: 'Price (high to low)', value: 'hilo' },
} as const;

export type SortOptionKey = keyof typeof sortOptions;
export type SortOption = typeof sortOptions[SortOptionKey];
