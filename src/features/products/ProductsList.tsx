import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToCart } from '../cart/cartSlice';
import { fetchProducts } from './productsSlice';

export function ProductsList() {
  const dispatch = useAppDispatch();
  const { items: products, status, error } = useAppSelector(
    (state) => state.products,
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <p className="notice">Đang tải danh sách sản phẩm...</p>;
  }

  if (status === 'failed') {
    return <p className="notice error">{error}</p>;
  }

  return (
    <section>
      <h2>Sản phẩm</h2>
      <div className="products-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} />
            <div className="product-info">
              <p className="category">{product.category}</p>
              <h3>{product.title}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <button type="button" onClick={() => dispatch(addToCart(product))}>
                Thêm vào giỏ
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
