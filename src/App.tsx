import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import HomePage from "../src/pages/homepage";
import ErrorPage from "./components/layout/ErrorPage";
import UserDashboard from "./pages/UserDashboard";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import Blog from "./pages/blog";
import AdminLayout from "./pages/admimlayout";

// Auth Features
import RegisterPage from "./features/register/register";
import Login from "./features/login/login";
import ForgotPassword from "./features/settings/settings";

// User Features
import AddressesPage from "./features/addresses/address";
import OrdersPage from "./features/order/order";
import UserContacts from "./features/contacts/contacts";
import UserSetting from "./features/settings/passoword";

// Admin Features
import AdminProduct from "./features/products/adminmanageProduct";
import AdminManageCategories from "./features/categories/categories";
import AdminManageDeals from "./features/deals/AdminManagedeals";
import AdminManagebanner from "./features/banner/AdminManagebanner";
import AdminManageOrders from "./features/order/adminmanageorder";
import AdminManageContacts from "./features/contacts/adminmanagecontacts";

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
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/shop",
    element: <ProductsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/category/:categoryId",
    element: <CategoryPage />,
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
    path: "/user/dashboard",
    element: <UserDashboard />,
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
    path: "/contact",
    element: <UserContacts />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: <UserSetting />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/blog",
    element: <Blog />,
    errorElement: <ErrorPage />,
  },
  // Admin Routes
  {
    path: "/admin/dashboard",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/products",
    element: <AdminProduct />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/categories",
    element: <AdminManageCategories />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/deals",
    element: <AdminManageDeals />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/banners",
    element: <AdminManagebanner />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/orders",
    element: <AdminManageOrders />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/messages",
    element: <AdminManageContacts />,
    errorElement: <ErrorPage />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
