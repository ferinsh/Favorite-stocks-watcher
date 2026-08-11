import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedRequests = [];

const processQueue = (error, token = null) => {
    failedRequests.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedRequests = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedRequests.push({
                    resolve,
                    reject,
                });
            }).then((token) => {
                originalRequest.headers.Authorization =
                    `Bearer ${token}`;

                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken =
                localStorage.getItem("refreshToken");

            if (!refreshToken) {
                throw new Error("No refresh token available.");
            }

            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/refresh/",
                {
                    refresh: refreshToken,
                }
            );

            const newAccessToken = response.data.access;

            localStorage.setItem(
                "accessToken",
                newAccessToken
            );

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            window.location.href = "/login";

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export const getPortfolioShares = async () => {
    const response = await api.get("/portfolio/shares/");
    return response.data;
};

export const sharePortfolio = async (username) => {
    const response = await api.post(
        "/portfolio/shares/",
        { username }
    );

    return response.data;
};

export const removePortfolioShare = async (id) => {
    await api.delete(`/portfolio/shares/${id}/`);
};

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

export default api;