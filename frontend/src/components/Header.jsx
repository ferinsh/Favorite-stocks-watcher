import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/dashboard" className="logo">
                    StockWatch
                </Link>

                <nav className="navigation">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/favorites">My Stocks</Link>
                </nav>
            </div>

            <div className="user-section">
                {user && (
                    <>
                        <div className="user-info">
                            <strong>
                                {user.first_name || user.username}
                            </strong>

                            <span>{user.email}</span>

                            <small>@{user.username}</small>
                        </div>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;