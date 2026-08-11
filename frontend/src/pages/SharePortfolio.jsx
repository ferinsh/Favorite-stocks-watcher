import { useEffect, useState } from "react";

import Header from "../components/Header";

import {
    getPortfolioShares,
    sharePortfolio,
    removePortfolioShare,
} from "../services/portfolio";

function SharePortfolio() {
    const [username, setUsername] = useState("");
    const [shares, setShares] = useState([]);

    const [loading, setLoading] = useState(true);
    const [sharing, setSharing] = useState(false);
    const [error, setError] = useState("");

    const loadShares = async () => {
        try {
            const data = await getPortfolioShares();
            setShares(data);
        } catch (error) {
            setError("Failed to load portfolio shares.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShares();
    }, []);

    const handleShare = async (event) => {
        event.preventDefault();

        if (!username.trim()) {
            return;
        }

        try {
            setSharing(true);
            setError("");

            await sharePortfolio(username);

            setUsername("");

            await loadShares();
        } catch (error) {
            const data = error.response?.data;

            if (data) {
                const messages = Object.values(data).flat();
                setError(messages.join(" "));
            } else {
                setError("Failed to share portfolio.");
            }
        } finally {
            setSharing(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await removePortfolioShare(id);
            await loadShares();
        } catch (error) {
            setError("Failed to remove sharing.");
        }
    };

    return (
        <div className="app">
            <Header />

            <main className="dashboard">
                <div className="dashboard-heading">
                    <h1>Share Portfolio</h1>

                    <p>
                        Give another StockWatch user read-only
                        access to your portfolio.
                    </p>
                </div>

                <section className="stock-section">
                    <h2>Share With a Friend</h2>

                    <form
                        className="add-stock-form"
                        onSubmit={handleShare}
                    >
                        <input
                            type="text"
                            placeholder="Friend's username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={sharing}
                        >
                            {sharing
                                ? "Sharing..."
                                : "Share Portfolio"}
                        </button>
                    </form>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <h2 className="share-heading">
                        People You Share With
                    </h2>

                    {loading ? (
                        <div className="empty-state">
                            Loading...
                        </div>
                    ) : shares.length === 0 ? (
                        <div className="empty-state">
                            <p>
                                You aren't sharing your portfolio
                                with anyone yet.
                            </p>
                        </div>
                    ) : (
                        <div className="stock-list">
                            {shares.map((share) => (
                                <div
                                    className="stock-row"
                                    key={share.id}
                                >
                                    <div>
                                        <strong>
                                            @{share.username}
                                        </strong>

                                        <span>
                                            Portfolio access granted
                                        </span>
                                    </div>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleRemove(share.id)
                                        }
                                    >
                                        Stop Sharing
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default SharePortfolio;