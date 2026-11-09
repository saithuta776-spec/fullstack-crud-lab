import { lazy, Suspense } from "react";

import { createBrowserRouter } from "react-router";
import RootLayout from "./pages/RootLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "@/pages/Error";

// import Blog from "./pages/blogs/Blog";
// import BlogRootLayout from "./pages/blogs/BlogRootLayout";
// import BlogDetail from "./pages/blogs/BlogDetail";

const Blog = lazy(() => import("./pages/blogs/Blog"));
const BlogRootLayout = lazy(() => import("./pages/blogs/BlogRootLayout"));
const BlogDetail = lazy(() => import("./pages/blogs/BlogDetail"));

import ProductRootLayout from "./pages/products/ProductRootLayout";
import Product from "@/pages/products/Prouct";
import ProductDetail from "./pages/products/ProductDetail";
import SignIn from "./pages/SignIn";

import LogIn from "@/pages/auth/LogIn";
import Register from "@/pages/auth/Register";
import { homeLoader } from "./router/loader";

const SuspenseFallback = () => <div className="text-center">Loading...</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Error />,
    children: [
      {
        index: true,
        Component: Home,
        loader: homeLoader,
      },

      {
        path: "about",
        Component: About,
      },

      {
        path: "blogs",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <BlogRootLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <Blog />
              </Suspense>
            ),
          },
          {
            path: ":postId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <BlogDetail />
              </Suspense>
            ),
          },
        ],
      },

      {
        path: "products",
        Component: ProductRootLayout,
        children: [
          { index: true, Component: Product },
          { path: ":productId", Component: ProductDetail },
        ],
      },

      {
        path: "signIn",
        Component: SignIn,
      },
    ],
  },
  {
    path: "/logIn",
    Component: LogIn,
  },

  {
    path: "/register",
    Component: Register,
  },
]);
