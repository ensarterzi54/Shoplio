import { useRoutes } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Orders from './pages/Orders';
import OrderDetailsPage from './pages/OrderDetailsPage';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/products', element: <Products /> },
    { path: '/orders', element: <Orders /> },
    { path: '/order-details/:orderId', element: <OrderDetailsPage /> }
  ])

  return routes
}

export default AppRoutes
