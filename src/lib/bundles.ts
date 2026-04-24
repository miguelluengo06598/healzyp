// Datos de bundles compartidos entre servidor y cliente.
// Sin "use client" ni "use server" para que sea importable desde ambos contextos.

export const CARD_DISCOUNT_CENTS = 500; // €5.00

export type Bundle = {
  id: number;
  name: string;
  price: string;
  priceInCents: number;
  popular: boolean;
};

export const BUNDLES: Bundle[] = [
  { id: 1, name: "1 Bote",  price: "29,99€", priceInCents: 2999, popular: false },
  { id: 2, name: "2 Botes", price: "44,99€", priceInCents: 4499, popular: true  },
  { id: 3, name: "3 Botes", price: "59,99€", priceInCents: 5999, popular: false },
];
