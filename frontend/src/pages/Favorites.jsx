// import { useEffect, useState } from "react";
// import Header from "../components/Header";
// import { useAuth } from "../context/AuthContext";
// import {
//     getFavoriteStocks,
//     getFavoriteStockQuotes,
//     addFavoriteStock,
//     deleteFavoriteStock,
// } from "../services/portfolio";

// function Favorites() {
//     const { accessToken } = useAuth();

//     const [stocks, setStocks] = useState([]);
//     const [quotes, setQuotes] = useState([]);
//     const [symbol, setSymbol] = useState("");

//     const [loading, setLoading] = useState(true);
//     const [adding, setAdding] = useState(false);
//     const [error, setError] = useState("");

//     const loadStocks = async () => {
//         try {
//             setLoading(true);

//             const stockData = await getFavoriteStocks(accessToken);

//             setStocks(stockData);

//             const quoteData = await getFavoriteStockQuotes(accessToken);

//             setQuotes(quoteData);
//         } catch (error) {
//             setError("Failed to load your stocks.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // useEffect(() => {
//     //     if (accessToken) {
//     //         loadStocks();
//     //     }
//     // }, [accessToken]);

//     useEffect(() => {
//         if (!accessToken) {
//             return;
//         }

//         loadStocks();

//         const interval = setInterval(() => {
//             loadStocks();
//         }, 60 * 1000);

//         return () => clearInterval(interval);
//     }, [accessToken]);

//     const handleAddStock = async (event) => {
//         event.preventDefault();

//         if (!symbol.trim()) {
//             return;
//         }

//         try {
//             setAdding(true);
//             setError("");

//             const newStock = await addFavoriteStock(
//                 accessToken,
//                 symbol
//             );

//             setStocks((currentStocks) => [
//                 ...currentStocks,
//                 newStock,
//             ]);

//             setSymbol("");
//         } catch (error) {
//             const data = error.response?.data;

//             if (data) {
//                 const messages = Object.values(data).flat();
//                 setError(messages.join(" "));
//             } else {
//                 setError("Failed to add stock.");
//             }
//         } finally {
//             setAdding(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             await deleteFavoriteStock(accessToken, id);

//             setStocks((currentStocks) =>
//                 currentStocks.filter((stock) => stock.id !== id)
//             );
//         } catch (error) {
//             setError("Failed to remove stock.");
//         }
//     };

//     return (
//         <div className="app">
//             <Header />

//             <main className="dashboard">
//                 <div className="dashboard-heading">
//                     <h1>My Stocks</h1>

//                     <p>
//                         Manage the stocks you're currently monitoring.
//                     </p>
//                 </div>

//                 <section className="stock-section">
//                     <div className="section-header">
//                         <div>
//                             <h2>Favorite Stocks</h2>

//                             <p>
//                                 Add stocks using their market symbol.
//                             </p>
//                         </div>
//                     </div>

//                     <form
//                         className="add-stock-form"
//                         onSubmit={handleAddStock}
//                     >
//                         <input
//                             type="text"
//                             placeholder="e.g. AAPL"
//                             value={symbol}
//                             onChange={(event) =>
//                                 setSymbol(event.target.value)
//                             }
//                         />

//                         <button
//                             type="submit"
//                             className="primary-button"
//                             disabled={adding}
//                         >
//                             {adding ? "Adding..." : "Add Stock"}
//                         </button>
//                     </form>

//                     {error && (
//                         <div className="error-message">
//                             {error}
//                         </div>
//                     )}

//                     {loading ? (
//                         <div className="empty-state">
//                             Loading stocks...
//                         </div>
//                     ) : stocks.length === 0 ? (
//                         <div className="empty-state">
//                             <h2>No stocks yet</h2>

//                             <p>
//                                 Add your first stock above.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="stock-list">
//                             {quotes.map((stock) => (
//                                 <div
//                                     className="stock-row"
//                                     key={stock.symbol}
//                                 >
//                                     <div className="stock-info">
//                                         <strong>{stock.symbol}</strong>

//                                         <span>{stock.name}</span>
//                                     </div>

//                                     <div className="stock-price">
//                                         {stock.price !== null
//                                             ? `$${stock.price.toFixed(2)}`
//                                             : "Price unavailable"}
//                                     </div>

//                                     <div className="stock-change">
//                                         {stock.change_percent !== null
//                                             ? `${stock.change_percent.toFixed(2)}%`
//                                             : "-"}
//                                     </div>

//                                     <button
//                                         className="delete-button"
//                                         onClick={() => {
//                                             const favorite = stocks.find(
//                                                 (item) =>
//                                                     item.symbol === stock.symbol
//                                             );

//                                             if (favorite) {
//                                                 handleDelete(favorite.id);
//                                             }
//                                         }}
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </section>
//             </main>
//         </div>
//     );
// }

// export default Favorites;

import { useEffect, useState } from "react";

import Header from "../components/Header";
import StockTable from "../components/StockTable";

import { useAuth } from "../context/AuthContext";

import {
    getFavoriteStocks,
    getFavoriteStockQuotes,
    addFavoriteStock,
    deleteFavoriteStock,
} from "../services/portfolio";

function Favorites() {
    const { accessToken } = useAuth();

    const [stocks, setStocks] = useState([]);
    const [quotes, setQuotes] = useState([]);

    const [symbol, setSymbol] = useState("");

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

    const loadStocks = async () => {
        try {
            setError("");

            const favoriteStocks = await getFavoriteStocks();
            const stockQuotes = await getFavoriteStockQuotes();

            setStocks(favoriteStocks);
            setQuotes(stockQuotes);
        } catch (error) {
            setError("Failed to load your stocks.");
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

    const handleAddStock = async (event) => {
        event.preventDefault();

        if (!symbol.trim()) {
            return;
        }

        try {
            setAdding(true);
            setError("");

            await addFavoriteStock(symbol);

            setSymbol("");

            await loadStocks();
        } catch (error) {
            const data = error.response?.data;

            if (data) {
                const messages = Object.values(data).flat();
                setError(messages.join(" "));
            } else {
                setError("Failed to add stock.");
            }
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (stockSymbol) => {
        try {
            const stock = stocks.find(
                (item) => item.symbol === stockSymbol
            );

            if (!stock) {
                return;
            }

            await deleteFavoriteStock(stock.id);

            await loadStocks();
        } catch (error) {
            setError("Failed to remove stock.");
        }
    };

    return (
        <div className="app">
            <Header />

            <main className="dashboard">
                <div className="dashboard-heading">
                    <h1>My Stocks</h1>

                    <p>
                        Manage the stocks you're currently monitoring.
                    </p>
                </div>

                <section className="stock-section">
                    <div className="section-header">
                        <div>
                            <h2>Favorite Stocks</h2>
                            <p>
                                Prices update automatically every minute.
                            </p>
                        </div>
                    </div>

                    <form
                        className="add-stock-form"
                        onSubmit={handleAddStock}
                    >
                        <input
                            type="text"
                            placeholder="Stock symbol, e.g. AAPL"
                            value={symbol}
                            onChange={(event) =>
                                setSymbol(event.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={adding}
                        >
                            {adding
                                ? "Adding..."
                                : "Add Stock"}
                        </button>
                    </form>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="empty-state">
                            Loading stocks...
                        </div>
                    ) : (
                        <StockTable
                            stocks={quotes}
                            onDelete={handleDelete}
                            showDelete={true}
                        />
                    )}
                </section>
            </main>
        </div>
    );
}

export default Favorites;