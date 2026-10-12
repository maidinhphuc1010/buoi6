import { act, renderHook } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from './hooks';
import { addToCart } from '../features/cart/cartSlice';
import { createTestStore, createWrapper, product } from '../test/utils';

test('useAppDispatch returns the real store dispatch and dispatches actions', () => {
  const store = createTestStore();
  const { result } = renderHook(() => useAppDispatch(), { wrapper: createWrapper(store) });
  expect(result.current).toBe(store.dispatch);
  act(() => { result.current(addToCart(product)); });
  expect(store.getState().cart.items[0].quantity).toBe(1);
});

test('useAppSelector selects state and reacts to store updates', () => {
  const store = createTestStore();
  const { result } = renderHook(() => useAppSelector(state => state.cart.items.length), {
    wrapper: createWrapper(store),
  });
  expect(result.current).toBe(0);
  act(() => { store.dispatch(addToCart(product)); });
  expect(result.current).toBe(1);
});
