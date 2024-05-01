import { RouterProvider } from "react-router-dom";
import { RoutripThemeProvider } from "./context/ThemeContext";
import { router } from "./routes/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./apis/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RoutripThemeProvider>
        <RouterProvider router={router} />
      </RoutripThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
