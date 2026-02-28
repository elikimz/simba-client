


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
import AdminProduct from "./features/products/adminmanageProduct";
import AdminManageCategories from "./features/categories/categories";
// ✅ Admin
import AdminLayout from "./pages/admimlayout";
import AdminManageDeals from "./features/deals/AdminManagedeals";
import AdminManagebanner from "./features/banner/AdminManagebanner";
import AdminManageOrders from "./features/order/adminmanageorder";
import AdminManageContacts from "./features/contacts/adminmanagecontacts";
import UserContacts from "./features/contacts/contacts";
import UserSetting from "./features/settings/passoword";
import Blog from "./pages/blog";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
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
  },
  {
    path: "/product/:productId",
    element: <ProductDetailsPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/addresses",
    element: <AddressesPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/contact",
    element: <UserContacts />,
  },

   {
    path: "/blog",
    element: <Blog />,
   }
    ,
 

  // ✅ ADMIN ROUTES
  {
    path: "/admin/dashboard",
    element: <AdminLayout />, // Admin layout with sidebar
  },

  {
    path: "/admin/products",
    element: <AdminProduct />, // Admin product management page
  },

  {
    path: "/admin/categories",
    element: <AdminManageCategories />, // Admin category management page
  },
  {
    path: "/admin/deals",
    element: <AdminManageDeals />, // Admin deal management page
  },
  {
    path: "/admin/banners",
    element: <AdminManagebanner />, // Admin banner management page
  },
  {
    path: "/admin/orders",
    element: <AdminManageOrders />, // Admin orders management page
  },

  {
    path:"/admin/messages",
    element: <AdminManageContacts />, // Admin contact management page
  },
  {
    path:"/settings",
    element: <UserSetting />, // User setting page
 }

]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;