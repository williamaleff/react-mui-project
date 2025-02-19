import './shared/forms/TraducoesYup';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AppRoutes } from "./routes"
import { AppThemeProvider, AuthProvider, DrawerProvider } from "./shared/contexts"
import { Login, MenuLateral } from "./shared/components";
import ClockPage from './pages/clockpage/ClockPage';

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <BrowserRouter>

          {/* Rota pública fora do contexto de login */}
          <Routes>
            <Route path="/clock" element={<ClockPage />} />
            <Route
              path="/*"
              element={
                <Login>
                  <DrawerProvider>
                    <MenuLateral>
                      <AppRoutes />
                    </MenuLateral>
                  </DrawerProvider>
                </Login>
              }
            />
          </Routes>

        </BrowserRouter>
      </AppThemeProvider>
    </AuthProvider>
  );
}
