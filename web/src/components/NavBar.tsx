import {useState} from 'react'
import {NavLink} from 'react-router-dom'

const navItems = [
  {label: 'Home', to: '/'},
  {label: 'About Us', to: '/about-us'},
  {label: 'Services', to: '/services'},
  {label: 'Projects', to: '/projects'},
  {label: 'Contact Us', to: '/contact-us'},
]

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <NavLink className="brand" to="/">
          Simple Company
        </NavLink>
        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <div
          className={isMenuOpen ? 'nav-links nav-links-open' : 'nav-links'}
          id="primary-navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')}
              to={item.to}
              end={item.to === '/'}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default NavBar
