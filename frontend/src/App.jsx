import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import SharePortfolio from "./pages/SharePortfolio";
import SharedPortfolios from "./pages/SharedPortfolios";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />
                    <Route
                      path="/favorites"
                      element={<Favorites />}
                    />
                    <Route
                      path="/share"
                      element={<SharePortfolio />}
                    />
                    <Route
                      path="/shared"
                      element={<SharedPortfolios />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<Login />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;