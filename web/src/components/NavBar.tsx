import {NavLink} from 'react-router-dom'

const navItems = [
  {label: 'Home', to: '/'},
  {label: 'About Us', to: '/about-us'},
  {label: 'Services', to: '/services'},
  {label: 'Projects', to: '/projects'},
  {label: 'Contact Us', to: '/contact-us'},
]

function NavBar() {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <NavLink className="brand" to="/">
          Simple Company
        </NavLink>
        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')}
              to={item.to}
              end={item.to === '/'}
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
