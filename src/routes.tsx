import { useRoutes } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/products', element: <Products /> }
  ]);

  return routes;
};

export default AppRoutes;
