import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { ProductsList } from './ProductsList';
import { fetchProducts } from './productsSlice';
import { createTestStore, mockProductsResponse, product, renderWithStore } from '../../test/utils';

describe('ProductsList integration with mocked API', () => {
  test('shows loading then displays products from the API', async () => {
    mockProductsResponse();
    renderWithStore(<ProductsList />);
    expect(screen.getByText('Đang tải danh sách sản phẩm...')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: product.title })).toBeInTheDocument();
    expect(screen.queryByText('Đang tải danh sách sản phẩm...')).not.toBeInTheDocument();
    expect(screen.getByText('$12.50')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('displays HTTP error instead of products', async () => {
    jest.mocked(fetch).mockResolvedValue({ ok: false } as Response);
    renderWithStore(<ProductsList />);
    expect(await screen.findByText('Không thể tải danh sách sản phẩm.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Thêm vào giỏ' })).not.toBeInTheDocument();
  });

  test('displays a network error', async () => {
    jest.mocked(fetch).mockRejectedValue(new Error('Network offline'));
    renderWithStore(<ProductsList />);
    expect(await screen.findByText('Network offline')).toBeInTheDocument();
  });

  test('renders an empty API result successfully', async () => {
    mockProductsResponse([]);
    const { store } = renderWithStore(<ProductsList />);
    expect(await screen.findByRole('heading', { name: 'Sản phẩm' })).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(store.getState().products.status).toBe('succeeded');
  });

  test('does not fetch again when products are already loaded', () => {
    const store = createTestStore();
    store.dispatch(fetchProducts.fulfilled([product], 'id'));
    renderWithStore(<ProductsList />, store);
    expect(screen.getByRole('heading', { name: product.title })).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  test('App loads products and adding twice updates the visible cart', async () => {
    const user = userEvent.setup();
    mockProductsResponse();
    const { store } = renderWithStore(<App />);
    const addButton = await screen.findByRole('button', { name: 'Thêm vào giỏ' });
    await user.click(addButton);
    await user.click(addButton);
    const cart = within(screen.getByRole('complementary'));
    expect(cart.getByRole('heading', { name: product.title })).toBeInTheDocument();
    expect(cart.getByText('Tổng số lượng: 2')).toBeInTheDocument();
    expect(cart.getByText('Tổng tiền: $25.00')).toBeInTheDocument();
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });
});
