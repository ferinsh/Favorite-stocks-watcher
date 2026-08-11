import { useEffect, useState } from "react";

import Header from "../components/Header";

import {
    getSharedPortfolios,
    getSharedPortfolioStocks,
} from "../services/portfolio";

function SharedPortfolios() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] =
        useState(null);

    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPortfolios = async () => {
            try {
                const data = await getSharedPortfolios();
                setPortfolios(data);
            } catch (error) {
                setError(
                    "Failed to load shared portfolios."
                );
            } finally {
                setLoading(false);
            }
        };

        loadPortfolios();
    }, []);

    const viewPortfolio = async (portfolio) => {
        try {
            setSelectedPortfolio(portfolio);
            setError("");

            const data =
                await getSharedPortfolioStocks(
                    portfolio.id
                );

            setStocks(data.stocks);
        } catch (error) {
            setError(
                "Failed to load the shared portfolio."
            );
        }
    };

    return (
        <div className="app">
            <Header />

            <main className="dashboard">
                <div className="dashboard-heading">
                    <h1>Shared Portfolios</h1>

                    <p>
                        Portfolios that other users have shared
                        with you.
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="empty-state">
                        Loading...
                    </div>
                ) : portfolios.length === 0 ? (
                    <div className="empty-state">
                        <h2>No shared portfolios</h2>

                        <p>
                            Nobody has shared their portfolio
                            with you yet.
                        </p>
                    </div>
                ) : (
                    <section className="stock-section">
                        <h2>Portfolios</h2>

                        <div className="stock-list">
                            {portfolios.map((portfolio) => (
                                <div
                                    className="stock-row"
                                    key={portfolio.id}
                                >
                                    <strong>
                                        @{portfolio.owner_username}
                                    </strong>

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            viewPortfolio(
                                                portfolio
                                            )
                                        }
                                    >
                                        View Portfolio
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {selectedPortfolio && (
                    <section className="stock-section shared-stocks">
                        <h2>
                            @{selectedPortfolio.owner_username}'s
                            Portfolio
                        </h2>

                        {stocks.length === 0 ? (
                            <div className="empty-state">
                                This portfolio is currently
                                empty.
                            </div>
                        ) : (
                            <div className="stock-list">
                                {stocks.map((stock) => (
                                    <div
                                        className="stock-row"
                                        key={stock.id}
                                    >
                                        <strong>
                                            {stock.symbol}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default SharedPortfolios;