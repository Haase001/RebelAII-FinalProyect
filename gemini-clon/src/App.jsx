import { useEffect, useContext } from "react";
import { Context } from "./context/Context.jsx";
import Layout from "./components/Layout.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {

  const { darkMode } = useContext(Context)

    //Cambia las clases del body al cambiar el estado de darkmode
  useEffect(() => {
    //Cambia la clase del <body> para activar el modo oscuro o el claro
    document.body.className = darkMode ? 'dark' : ''
    //Guarda el estado en localSotrage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]) //Se ejecuta cada vez que cambia el estado de darkMode

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  )
}

export default App
