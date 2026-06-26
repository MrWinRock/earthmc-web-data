import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import "./NavBar.css";

const LINKS = [
  { to: "/", label: "Status", end: true },
  { to: "/online", label: "Online" },
  { to: "/players", label: "Players" },
  { to: "/towns", label: "Towns" },
  { to: "/nations", label: "Nations" },
  { to: "/quarters", label: "Quarters" },
  { to: "/nearby", label: "Nearby" },
];

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand" onClick={closeMenu}>
          <span className="nav__logo" aria-hidden>
            ◆
          </span>
          <span>
            EarthMC<span className="nav__brand-accent"> Data</span>
          </span>
        </Link>

        <button
          type="button"
          className={`nav__toggle${menuOpen ? " is-open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`nav__links${menuOpen ? " is-open" : ""}`}
          aria-label="Primary"
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav__link${isActive ? " active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
