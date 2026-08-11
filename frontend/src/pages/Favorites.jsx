import Header from "../components/Header";

function Favorites() {
    return (
        <div className="app">
            <Header />

            <main className="dashboard">
                <div className="dashboard-heading">
                    <div>
                        <h1>My Stocks</h1>
                        <p>
                            Manage the stocks you're currently monitoring.
                        </p>
                    </div>
                </div>

                <section className="stock-section">
                    <div className="section-header">
                        <div>
                            <h2>Favorite Stocks</h2>
                            <p>
                                Add stocks by their market symbol.
                            </p>
                        </div>

                        <button className="primary-button">
                            + Add Stock
                        </button>
                    </div>

                    <div className="empty-state">
                        <h2>No stocks yet</h2>

                        <p>
                            Add your first stock to start building your
                            watchlist.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Favorites;