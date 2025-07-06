import AppRoutes from './routes'
import { CartProvider } from './context/CartContext'

const App = () => {
  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  )
}

export default App
