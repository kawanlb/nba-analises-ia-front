import { createBrowserRouter, Navigate } from "react-router";
import { Home } from "./pages/Home";
import { MatchComparison } from "./pages/MatchComparison";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Home },
      { path: "match/:team1Id/:team2Id", Component: MatchComparison },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);