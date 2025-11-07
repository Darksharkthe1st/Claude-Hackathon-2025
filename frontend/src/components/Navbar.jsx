import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          Wrench
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/projects">Projects</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/projects/new">Post Project</Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.name}</span>
              <button onClick={logout} className="text-sm underline">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

