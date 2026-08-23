import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/analysis', label: 'Yearly Analysis' },
  { to: '/search', label: 'Search' },
  { to: '/export', label: 'Export' },
]

/** Top navigation bar linking to every page; highlights the active route. */
export default function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">💰 Budget Tracker</span>
      <div className="navbar-links">
        {NAV_ITEMS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
