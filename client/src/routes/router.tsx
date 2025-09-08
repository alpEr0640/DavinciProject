import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../App";
import Homepage from "../pages/Home";
import NotFoundPage from "../pages/error/not-found";
import { RouterErrorBoundary } from "@/components";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    ErrorBoundary: RouterErrorBoundary,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
