import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearCart, removeFromCart, updateQuantity } from './cartSlice';

export function Cart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalQuantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  return (
    <aside className="cart-panel">
      <div className="cart-header">
        <h2>Giỏ hàng</h2>
        {cartItems.length > 0 && (
          <button className="ghost-button" type="button" onClick={() => dispatch(clearCart())}>
            Xoá tất cả
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p className="notice">Giỏ hàng đang trống.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`Giảm số lượng ${item.title}`}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      aria-label={`Số lượng ${item.title}`}
                      min="1"
                      type="number"
                      value={item.quantity}
                      onChange={(event) =>
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            quantity: Number(event.target.value),
                          }),
                        )
                      }
                    />
                    <button
                      type="button"
                      aria-label={`Tăng số lượng ${item.title}`}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            quantity: item.quantity + 1,
                          }),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Xoá
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <span>Tổng số lượng: {totalQuantity}</span>
            <strong>Tổng tiền: ${totalPrice.toFixed(2)}</strong>
          </div>
        </>
      )}
    </aside>
  );
}
