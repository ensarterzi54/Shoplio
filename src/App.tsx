import AppRoutes from './routes'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { OrderProvider } from './context/OrderContext'

const App = () => {
  return (
    <CartProvider>
      <ProductProvider>
        <OrderProvider>
          <AppRoutes />
        </OrderProvider>
      </ProductProvider>
    </CartProvider>
  )
}

export default App
