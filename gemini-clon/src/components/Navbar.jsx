import { Link, useNavigate } from 'react-router-dom'
import { useContext } from "react";
import { Context } from '../context/Context.jsx';

const Navbar = () => {

    //Navegación
    const navigate = useNavigate();

    const { user, setUser, sidebarWidth, darkMode, setDarkMode, isSidebarHidden} = useContext(Context);
    //Convertimos el formato de sidebarWidht para usarlo en nuestro componente
    const width = `${!isSidebarHidden ? sidebarWidth : 0}px`
    
    //Funcion para mostrar diferentes vistas de acuerdo al si un usuarioo esta loggeado o no
    const logout = ()=>{

        if (window.confirm("¿Seguro que quieres cerrar sesión?")) {
            navigate("/");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(false);
            console.log('logout exitoso');
        } else {
            return;
        }
        
    }

    const login = ()=>{
        navigate("/auth")
    }

    return(
        <nav 
        className="bg-white dark:bg-gray-950 dark:text-gray-200 shadow-md py-4 px-6 flex justify-between items-center"
        style={{marginLeft: width}}
        >
            {/* Logo/Nombre de la página a la izquierda */}
            <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold text-gray-500 dark:text-gray-200">
                    <Link to={"/"}>RebelAI</Link>
                </h1>
                <button className='flex items-center justify-center text-xs w-20 h-5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 rounded-xl'>
                    2.5 Flash ▼
                </button>
            </div>

            {/* Contenedor de botones a la derecha */}
            <div className="flex items-center space-x-4"> 
                <button 
                className='flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 dark:text-yellow-500 rounded-full hover:bg-gray-300 transition-colors' 
                onClick={() => setDarkMode(!darkMode)}
                >
                    <i className={`fa-regular fa-${darkMode ? "sun":"moon"}`}></i>
                </button>
                {/* Contenido condicional según estado de autenticación */}
                {user ? (
                    // Usuario autenticado: Botón Probar e icono de usuario
                    <>
                        <button 
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Probar
                        </button>
                        <button 
                        className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                        onClick={logout}
                        >
                            <i className="fa-regular fa-user"></i>
                        </button>
                    </>
                ) : (
                    // Usuario no autenticado: Botón de About y botón de inicio de sesión
                    <>
                        <button className="text-gray-600">
                            Acerca de Rebel
                        </button>
                        <button 
                        className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 px-6 py-2 rounded-md transition-colors"
                        onClick={login}
                        >
                            Iniciar sesión
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar