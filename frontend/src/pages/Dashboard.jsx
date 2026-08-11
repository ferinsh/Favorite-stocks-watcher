import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import StockTable from "../components/StockTable";

import { useAuth } from "../context/AuthContext";

import {
    getFavoriteStockQuotes,
} from "../services/portfolio";

function Dashboard() {
    const { user, accessToken } = useAuth();

    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadStocks = async () => {
        try {
            const data = await getFavoriteStockQuotes();
            setStocks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        loadStocks();

        const interval = setInterval(() => {
            loadStocks();
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [accessToken]);

    return (
        <div className="app">
            <Header />

            <main className="dashboard">
                <div className="dashboard-heading">
                    <h1>Dashboard</h1>

                    <p>
                        Welcome back,{" "}
                        {user?.first_name || user?.username}.
                    </p>
                </div>

                <section className="stock-section">
                    <div className="section-header">
                        <div>
                            <h2>Your Portfolio</h2>

                            <p>
                                Your favorite stocks and their
                                current prices.
                            </p>
                        </div>

                        <Link
                            to="/favorites"
                            className="primary-button"
                        >
                            Manage Stocks
                        </Link>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            Loading your portfolio...
                        </div>
                    ) : (
                        <StockTable stocks={stocks} />
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;