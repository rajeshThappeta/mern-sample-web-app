import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import UserPanel from "./components/userpanel/UserPanel";
import AdminPanel from "./components/adminpanel/AdminPanel";
import { RouterProvider } from "react-router-dom";

function App() {
  let browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: <UserPanel />,
        },
        {
          path: "admin-profile",
          element: <AdminPanel />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;
