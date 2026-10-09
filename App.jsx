import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexto/AuthContext";
import Rutas from "./app/routes/Rutas";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Rutas />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
