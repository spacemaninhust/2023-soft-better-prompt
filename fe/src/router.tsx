import { createHashRouter } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Personal from "./pages/Personal"
import Index from "./pages/Index"
import Author from "./pages/Author"
import Application from "./pages/Application"
import Apps from "./pages/App"
import Chat from "./pages/Chat"
const router = createHashRouter([
    {
        path: "",
        element: <Index />,
    },
    {
        path: "/Home",
        element: <Home/>,
    },
    {
        path: "/Application",
        element: <Application/>,
    },
    {
        path: "/Apps/:id",
        element: <Apps/>,
    },
    {
        path: "/Chat",
        element: <Chat/>,
    },
    {
        path: "/Login",
        element: <Login/>,
    },
    {
        path: "/Register",
        element: <Register/>,
    },
    {
        path: "/Author",
        element: <Author/>,
    },
    {
        path: "/Personal",
        element: <Personal/>,
    }
])
export default router