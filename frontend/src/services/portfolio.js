import api from "./api";

// Favorite stocks

export const getFavoriteStocks = async () => {
    const response = await api.get("/portfolio/favorites/");
    return response.data;
};

export const addFavoriteStock = async (symbol) => {
    const response = await api.post(
        "/portfolio/favorites/",
        {
            symbol,
        }
    );

    return response.data;
};

export const deleteFavoriteStock = async (id) => {
    await api.delete(`/portfolio/favorites/${id}/`);
};

// Stock quotes

export const getFavoriteStockQuotes = async () => {
    const response = await api.get("/stocks/quotes/");
    return response.data;
};

// Portfolio sharing

export const getPortfolioShares = async () => {
    const response = await api.get("/portfolio/shares/");
    return response.data;
};

export const sharePortfolio = async (username) => {
    const response = await api.post(
        "/portfolio/shares/",
        {
            username,
        }
    );

    return response.data;
};

export const removePortfolioShare = async (id) => {
    await api.delete(`/portfolio/shares/${id}/`);
};

// Portfolios shared with the current user

export const getSharedPortfolios = async () => {
    const response = await api.get(
        "/portfolio/shared-with-me/"
    );

    return response.data;
};

export const getSharedPortfolioStocks = async (shareId) => {
    const response = await api.get(
        `/portfolio/shared-with-me/${shareId}/`
    );

    return response.data;
};