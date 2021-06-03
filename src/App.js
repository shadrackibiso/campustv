import React, { Suspense, lazy } from "react";
import "./css/App.css";
import "./css/bootstrap.min.css";
import SplashScreen from "./components/SplashScreen";
const AppRouter = lazy(() => import("./routes/AppRouter"));

function App() {
  return (
    <div>
      <Suspense fallback={<SplashScreen />}>
        <AppRouter />
      </Suspense>
    </div>
  );
}

export default App;
