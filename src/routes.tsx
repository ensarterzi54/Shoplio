import { Navigate, useRoutes } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Orders from './pages/Orders';
import OrderDetailsPage from './pages/OrderDetailsPage';
import Login from './pages/login/Login';
import Admin from './pages/Admin';
import User from './pages/User';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
// import ChatBot from './components/Chat';
const AppRoutes = () => {
  const isAuthenticated = localStorage.getItem('jwt') !== null;
  console.log("Is Authenticated:", isAuthenticated);
  const routes = useRoutes([
    { 
      path: '/login', 
      element: isAuthenticated ? <Navigate to="/" replace /> : <Login />,
    },
    { 
      path: '/unauthorized', 
      element: <Unauthorized /> 
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: '/products',
      element: (
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      ),
    },
    {
      path: '/orders',
      element: (
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      ),
    },
    {
      path: '/order-details/:orderId',
      element: (
        <ProtectedRoute>
          <OrderDetailsPage />
        </ProtectedRoute>
      ),
    },
    // {
    //   path: '/chat-bot',
    //   element: (
    //     <ProtectedRoute>
    //       <ChatBot />
    //     </ProtectedRoute>
    //   ),
    // },

    {
      path: '/admin',
      element: (
        <ProtectedRoute requiredRole="Admin">
          <Admin />
        </ProtectedRoute>
      ),
    },
    {
      path: '/user',
      element: (
        <ProtectedRoute requiredRole="User">
          <User />
        </ProtectedRoute>
      ),
    }
  ])

  return routes;
};

export default AppRoutes;
