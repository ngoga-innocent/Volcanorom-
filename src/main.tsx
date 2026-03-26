import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./app/store";
import AppRoutes from "./components/Routes/AppRoutes";
import "./index.css";
import { LoaderProvider } from "./app/LoaderContext";
import GlobalLoader from "./components/GlobalLoader";
import ScrollToTop from "./components/layouts/Navigation/scrolltoTop";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LoaderProvider>
          <GlobalLoader />
          <ScrollToTop />
          <AppRoutes />
        </LoaderProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
