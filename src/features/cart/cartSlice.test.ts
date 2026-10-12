import reducer, { addToCart, clearCart, removeFromCart, updateQuantity } from './cartSlice';
import { product, secondProduct } from '../../test/utils';

const populated = () => reducer(reducer(undefined, addToCart(product)), addToCart(secondProduct));

describe('cart action creators and reducer', () => {
  test('addToCart creates the expected action', () => {
    expect(addToCart(product)).toEqual({ type: 'cart/addToCart', payload: product });
  });

  test('initializes an empty cart for an unknown action', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  test('adds a new product with quantity one', () => {
    expect(reducer(undefined, addToCart(product)).items).toEqual([
      { id: 1, title: product.title, price: 12.5, image: product.image, quantity: 1 },
    ]);
  });

  test('increments an existing product without mutating previous state', () => {
    const previous = populated();
    const next = reducer(previous, addToCart(product));
    expect(next.items).toHaveLength(2);
    expect(next.items[0].quantity).toBe(2);
    expect(previous.items[0].quantity).toBe(1);
  });

  test('removes only the requested product', () => {
    expect(reducer(populated(), removeFromCart(1)).items.map(item => item.id)).toEqual([2]);
  });

  test('ignores removal of a missing product', () => {
    const state = populated();
    expect(reducer(state, removeFromCart(999))).toEqual(state);
  });

  test('updates quantity and preserves other products', () => {
    const next = reducer(populated(), updateQuantity({ productId: 1, quantity: 4 }));
    expect(next.items.map(item => item.quantity)).toEqual([4, 1]);
  });

  test.each([0, -1])('removes the product when quantity is %s', quantity => {
    const next = reducer(populated(), updateQuantity({ productId: 1, quantity }));
    expect(next.items.map(item => item.id)).toEqual([2]);
  });

  test('ignores quantity changes for a missing product', () => {
    const state = populated();
    expect(reducer(state, updateQuantity({ productId: 999, quantity: 3 }))).toEqual(state);
  });

  test('clears the entire cart', () => {
    expect(reducer(populated(), clearCart())).toEqual({ items: [] });
  });
});
