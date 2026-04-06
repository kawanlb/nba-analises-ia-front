import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { MatchComparison } from "./pages/MatchComparison";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "match/:team1Id/:team2Id", Component: MatchComparison },
    ],
  },
]);