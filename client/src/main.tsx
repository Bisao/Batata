import { createRoot } from "react-dom/client";
import App from "./App";
import AppNew from "./AppNew";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Use o novo App para a versão modular do jogo
const UseNewVersion = true;

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {UseNewVersion ? <AppNew /> : <App />}
  </QueryClientProvider>
);
