import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "../src/pages/homepage";
import ErrorPage from "./components/layout/ErrorPage";
import RegisterPage from "./features/register/register";
import Login from "./features/login/login";
import UserDashboard from "./pages/UserDashboard";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import AddressesPage from "./features/addresses/address";
import OrdersPage from "./features/order/order";  
import ForgotPassword from "./features/settings/settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />, // catches route errors
  },
  {
    path: "/signin",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/user/dashboard",
    element: <UserDashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetailsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/addresses",
    element: <AddressesPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  }

  
  
  
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;