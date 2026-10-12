import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import cartReducer from '../features/cart/cartSlice';
import productsReducer, { type Product } from '../features/products/productsSlice';

export const product: Product = {
  id: 1, title: 'Test Backpack', price: 12.5,
  description: 'A backpack', category: 'bags', image: '/backpack.png',
};
export const secondProduct: Product = { ...product, id: 2, title: 'Test Bag', price: 20 };

export function createTestStore() {
  return configureStore({ reducer: { cart: cartReducer, products: productsReducer } });
}

export function createWrapper(store = createTestStore()) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  };
}

export function renderWithStore(ui: ReactElement, store = createTestStore()) {
  return { ...render(ui, { wrapper: createWrapper(store) }), store };
}

export function mockProductsResponse(items: Product[] = [product]) {
  const json = jest.fn().mockResolvedValue(items);
  jest.mocked(fetch).mockResolvedValue({ ok: true, json } as unknown as Response);
  return json;
}
