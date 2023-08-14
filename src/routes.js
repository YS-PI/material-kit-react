import { SignIn, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
/* import LoginPage from './pages/LoginPage'; */
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';


// ----------------------------------------------------------------------

export const ContainerLogin = ({ children }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center" }}>
      {children}
    </div>
  )
}

export const ProtectedLogin = ({ children }) => {
  const { user } = useUser();

  if (user !== null) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;

}

export const ProtectRoute = ({ children }) => {
  const { user } = useUser();

  if (user !== null) {
    return children;
  }

  return <Navigate to="/login" replace />;

}

export default function Router() {


  const routes = useRoutes([
    {
      path: '/dashboard',
      element:
        <ProtectRoute><SignedIn > <DashboardLayout /></SignedIn></ProtectRoute>,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/login',
      element: <ProtectedLogin><ContainerLogin><SignIn /></ContainerLogin></ProtectedLogin>,
    },
    /* {
      element: <SignedIn><SimpleLayout /></SignedIn>,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '*', element: <Navigate to="/dashboard/app" /> },
      ],
    }, */
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ]);

  return routes;
}
