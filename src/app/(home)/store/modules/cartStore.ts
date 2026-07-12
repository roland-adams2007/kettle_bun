import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  cartId: number
  name: string
  img: string
  unitPrice: number
  qty: number
  options: string
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cartId'>) => void
  removeItem: (cartId: number) => void
  changeQty: (cartId: number, dir: 1 | -1) => void
  clearCart: () => void
  subtotal: () => number
  count: () => number

  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  isMobileNavOpen: boolean
  toggleMobileNav: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const nextId = state.items.length
            ? Math.max(...state.items.map((i) => i.cartId)) + 1
            : 1
          return { items: [...state.items, { ...item, cartId: nextId }] }
        }),

      removeItem: (cartId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartId !== cartId),
        })),

      changeQty: (cartId, dir) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + dir } : i))
            .filter((i) => i.qty > 0),
        })),

      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      isMobileNavOpen: false,
      toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
    }),
    {
      name: 'kettle-bun-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)