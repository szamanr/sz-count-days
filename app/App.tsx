import { Route, Router } from "@solidjs/router";
import { DaysTracker } from "./DaysTracker/DaysTracker";
import { Schengen } from "./Schengen/Schengen";

const App = () => {
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
