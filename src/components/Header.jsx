function Header({ title, subtitle, user, onLogout }) {
  const firstLetter = user ? user.email.charAt(0).toUpperCase() : '?'

  return (
    <header>
      <div className="header-top">
        <div className="header-titles">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {user && (
          <div className="user-menu">
            <button className="avatar">{firstLetter}</button>
            <div className="dropdown">
              <p className="dropdown-email">{user.email}</p>
              <button className="dropdown-logout" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header