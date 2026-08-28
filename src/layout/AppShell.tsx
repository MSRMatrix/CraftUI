import { Outlet } from "react-router-dom";
import Navigation from '../components/pages/Navigation';

const AppShell = () => {
    return (
        <> <header>
        <h1>UI Crafter</h1>
      </header>

      <nav>
        <Navigation />
      </nav>

      <main>
        <Outlet />
      </main>
        </>
    )
};

export default AppShell;