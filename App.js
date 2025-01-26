import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import Main from "./Main";
import { RevenueCatProvider } from "./context/SubscriptionCtx";
import "./locales/i18n";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RevenueCatProvider>
          <Main />
        </RevenueCatProvider>
      </PersistGate>
    </Provider>
  );
}
