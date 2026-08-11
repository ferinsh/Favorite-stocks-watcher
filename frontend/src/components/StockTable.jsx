function StockTable({ stocks, onDelete, showDelete = false }) {
    if (stocks.length === 0) {
        return (
            <div className="empty-state">
                <h2>No stocks yet</h2>
                <p>
                    Add some stocks to start monitoring your portfolio.
                </p>
            </div>
        );
    }

    return (
        <div className="stock-table-wrapper">
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th>Price</th>
                        <th>Change</th>
                        {showDelete && <th></th>}
                    </tr>
                </thead>

                <tbody>
                    {stocks.map((stock) => (
                        <tr key={stock.symbol}>
                            <td>
                                <strong>{stock.symbol}</strong>
                            </td>

                            <td>
                                {stock.name || "Unknown"}
                            </td>

                            <td>
                                {stock.price !== null
                                    ? `$${stock.price.toFixed(2)}`
                                    : "Unavailable"}
                            </td>

                            <td>
                                <span
                                    className={
                                        stock.change_percent > 0
                                            ? "positive"
                                            : stock.change_percent < 0
                                            ? "negative"
                                            : ""
                                    }
                                >
                                    {stock.change_percent !== null
                                        ? `${stock.change_percent.toFixed(
                                              2
                                          )}%`
                                        : "-"}
                                </span>
                            </td>

                            {showDelete && (
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            onDelete(stock.symbol)
                                        }
                                    >
                                        Remove
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockTable;