import {
  BrowserRouter,
} from "react-router-dom";

import AppRoutes from "./routes";

import {
  registerPlugins,
} from "./plugins";

registerPlugins();

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;