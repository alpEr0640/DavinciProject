import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../App";
import { RouterErrorBoundary } from "../components/layout/error-boundary";
import Homepage from "../pages/Home";


export const router = createBrowserRouter([
    {
        path:"/",
        element: <AppLayout/>,
        ErrorBoundary: RouterErrorBoundary,
        children:[{
            index:true,
            element:<Homepage/>
        }]
    }
])