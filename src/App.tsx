import { Cart } from './features/cart/Cart';
import { ProductsList } from './features/products/ProductsList';

function App() {
  return (
    <main className="app-shell">
      <header className="hero">
        <p>Redux Toolkit + TypeScript</p>
        <h1>Shopping Cart Demo</h1>
      </header>
      <div className="layout">
        <ProductsList />
        <Cart />
      </div>
    </main>
  );
}

export default App;
