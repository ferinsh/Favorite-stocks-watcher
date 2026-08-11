import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="app">
            <Header />

            <main className="dashboard">
                <div className="dashboard-heading">
                    <div>
                        <h1>Dashboard</h1>
                        <p>
                            Welcome back, {user?.first_name || user?.username}.
                            Here's what's happening with your stocks.
                        </p>
                    </div>
                </div>

                <section className="dashboard-content">
                    <div className="empty-state">
                        <h2>Your portfolio is empty</h2>

                        <p>
                            Add your favorite stocks to start monitoring
                            their prices.
                        </p>

                        <a href="/favorites" className="primary-button">
                            Add Your First Stock
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;