import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const navArray = [
    {
      name: "Editor",
      path: "/editor",
    },
    {
      name: "Reset",
      path: "/reset",
    },
    {
      name: "Save",
      path: "/save",
    },
    {
      name: "Brain Storming",
      path: "/brain-storming",
    },
  ];

  // Styling Fenster

  return (
    <nav>
      <ul>
        {navArray.map((item) => (
          <li key={item.path}>
            <button className="navigation-button" onClick={() => navigate(item.path)}>{item.name}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
