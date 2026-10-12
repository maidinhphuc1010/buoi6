import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cart } from './Cart';
import { addToCart } from './cartSlice';
import { createTestStore, product, renderWithStore, secondProduct } from '../../test/utils';

function renderCart() {
  const store = createTestStore();
  store.dispatch(addToCart(product));
  store.dispatch(addToCart(secondProduct));
  return renderWithStore(<Cart />, store);
}

describe('Cart integration with real Redux store', () => {
  test('shows empty state without clear button', () => {
    renderWithStore(<Cart />);
    expect(screen.getByText('Giỏ hàng đang trống.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Xoá tất cả' })).not.toBeInTheDocument();
  });

  test('renders items and calculates total quantity and price', () => {
    renderCart();
    expect(screen.getByRole('img', { name: product.title })).toHaveAttribute('src', product.image);
    expect(screen.getByText('Tổng số lượng: 2')).toBeInTheDocument();
    expect(screen.getByText('Tổng tiền: $32.50')).toBeInTheDocument();
  });

  test('increments and decrements quantity through buttons', async () => {
    const user = userEvent.setup();
    const { store } = renderCart();
    await user.click(screen.getByRole('button', { name: `Tăng số lượng ${product.title}` }));
    expect(screen.getByRole('spinbutton', { name: `Số lượng ${product.title}` })).toHaveValue(2);
    expect(screen.getByText('Tổng tiền: $45.00')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: `Giảm số lượng ${product.title}` }));
    expect(store.getState().cart.items[0].quantity).toBe(1);
    expect(screen.getByText('Tổng tiền: $32.50')).toBeInTheDocument();
  });

  test('changes quantity through numeric input', () => {
    const { store } = renderCart();
    fireEvent.change(screen.getByRole('spinbutton', { name: `Số lượng ${product.title}` }), {
      target: { value: '3' },
    });
    expect(store.getState().cart.items[0].quantity).toBe(3);
    expect(screen.getByText('Tổng số lượng: 4')).toBeInTheDocument();
    expect(screen.getByText('Tổng tiền: $57.50')).toBeInTheDocument();
  });

  test('decrementing quantity one removes the item', async () => {
    const user = userEvent.setup();
    const { store } = renderCart();
    await user.click(screen.getByRole('button', { name: `Giảm số lượng ${product.title}` }));
    expect(screen.queryByRole('heading', { name: product.title })).not.toBeInTheDocument();
    expect(store.getState().cart.items.map(item => item.id)).toEqual([2]);
  });

  test('removes an item using the remove button', async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getAllByRole('button', { name: 'Xoá' })[0]);
    expect(screen.queryByRole('heading', { name: product.title })).not.toBeInTheDocument();
    expect(screen.getByText('Tổng tiền: $20.00')).toBeInTheDocument();
  });

  test('clears all items and returns to empty state', async () => {
    const user = userEvent.setup();
    const { store } = renderCart();
    await user.click(screen.getByRole('button', { name: 'Xoá tất cả' }));
    expect(store.getState().cart.items).toEqual([]);
    expect(screen.getByText('Giỏ hàng đang trống.')).toBeInTheDocument();
  });
});
