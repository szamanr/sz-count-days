import { Route, Router } from "@solidjs/router";
import { inject } from "@vercel/analytics";
import { onMount } from "solid-js";
import { DaysTracker } from "./DaysTracker/DaysTracker";
import { Schengen } from "./Schengen/Schengen";

const App = () => {
  onMount(() => {
    const isDev = import.meta.env.VITE_DEV
      ? JSON.parse(import.meta.env.VITE_DEV)
      : false;
    inject({ mode: isDev ? "development" : "production" });
  });

  return (
    <div class="min-h-screen w-full bg-gray-800 text-white">
      <Router>
        <Route component={DaysTracker} path="/" />
        <Route component={Schengen} path="/schengen" />
      </Router>
    </div>
  );
};

export default App;
