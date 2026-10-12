import reducer, { fetchProducts } from './productsSlice';
import { createTestStore, mockProductsResponse, product } from '../../test/utils';

describe('products reducer and async thunk', () => {
  test('initializes idle state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ items: [], status: 'idle', error: null });
  });

  test('pending clears a previous error', () => {
    const state = reducer({ items: [], status: 'failed', error: 'Old error' }, fetchProducts.pending('id'));
    expect(state).toEqual({ items: [], status: 'loading', error: null });
  });

  test('fetches the API and transitions from loading to succeeded', async () => {
    const json = mockProductsResponse();
    const store = createTestStore();
    const request = store.dispatch(fetchProducts());
    expect(store.getState().products.status).toBe('loading');
    await request;
    expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenCalledTimes(1);
    expect(store.getState().products).toEqual({ items: [product], status: 'succeeded', error: null });
  });

  test('rejects a non-OK HTTP response without parsing JSON', async () => {
    const json = jest.fn();
    jest.mocked(fetch).mockResolvedValue({ ok: false, json } as unknown as Response);
    const store = createTestStore();
    await store.dispatch(fetchProducts());
    expect(store.getState().products).toEqual({
      items: [], status: 'failed', error: 'Không thể tải danh sách sản phẩm.',
    });
    expect(json).not.toHaveBeenCalled();
  });

  test.each([
    [new Error('Network offline'), 'Network offline'],
    ['unexpected rejection', 'Đã xảy ra lỗi không xác định.'],
  ])('handles fetch rejection %s', async (error, message) => {
    jest.mocked(fetch).mockRejectedValue(error);
    const store = createTestStore();
    await store.dispatch(fetchProducts());
    expect(store.getState().products.status).toBe('failed');
    expect(store.getState().products.error).toBe(message);
  });

  test('uses serialized error when rejection has no payload', () => {
    const state = reducer(undefined, fetchProducts.rejected(new Error('Aborted request'), 'id'));
    expect(state.error).toBe('Aborted request');
  });

  test('uses fallback when rejection has neither payload nor error message', () => {
    const state = reducer(undefined, { type: fetchProducts.rejected.type, error: {} });
    expect(state.error).toBe('Không thể tải danh sách sản phẩm.');
  });
});
