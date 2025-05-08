import { Link } from 'react-router-dom';
import './NavBar.css';
import { useState } from 'react';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav>
            <h1>EarthMC Web Data</h1>
            <div className="menu-toggle" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <ul className={menuOpen ? 'open' : ''}>
                <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/players" onClick={closeMenu}>Players</Link></li>
                <li><Link to="/towns" onClick={closeMenu}>Towns</Link></li>
                <li><Link to="/nations" onClick={closeMenu}>Nations</Link></li>
                <li><Link to="/nearby" onClick={closeMenu}>Nearby</Link></li>
            </ul>
        </nav>
    )
}

export default NavBar;