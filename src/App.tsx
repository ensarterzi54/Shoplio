import AppRoutes from './routes'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'

const App = () => {
  return (
    <CartProvider>
      <ProductProvider>
        <AppRoutes />
      </ProductProvider>
    </CartProvider>
  )
}

export default App
