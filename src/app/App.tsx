import { RouterProvider } from "react-router-dom";
import "../styles/app.css";
import { router } from "./router";

function App() {


  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
