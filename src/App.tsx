import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./routes"
import { ThemeProvider } from "@emotion/react"
import { LightTHeme } from "./shared/themes";

export const App = () => {
  return (
    <ThemeProvider theme={LightTHeme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
