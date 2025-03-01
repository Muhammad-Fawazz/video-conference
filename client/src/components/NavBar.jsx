// component/NavBar.jsx

import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/room/create">Create Room</NavLink>
        </li>
      </ul>
    </nav>
  );
}
