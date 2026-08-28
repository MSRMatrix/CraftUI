import { createBrowserRouter } from "react-router-dom";
import AppShell from "../layout/AppShell";
import Editor from "../components/pages/Editor";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <AppShell />,
      children: [
        {
          path:"/editor",
          element: <Editor />
        }
      ],
    },
    {
      path: "*",
      element: <AppShell />,
    },
  ]);