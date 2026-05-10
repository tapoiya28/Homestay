import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import './App.css'

import MainLayout from './layouts/MainLayout'

// Pages
import { LoginPage } from './pages/Auth/Login';
import { RegisterPage } from './pages/Auth/Register';
import { ForgetPasswordPage } from './pages/Auth/ForgotPassword';
import MeetUpList from './pages/MeetUpList';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/meet-up" replace />,
  },
  {
    element: <MainLayout />,
    children: [
      { path: "meet-up", element: <MeetUpList /> },
    ]
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forget-password", element: <ForgetPasswordPage /> },
]);

const App = () => {
  return <RouterProvider router={router} />
}
export default App
