import { useState, useEffect, useContext } from 'react';
import { Context } from '../context/Context.jsx';
import Menu from './Menu.jsx';

const Sidebar = () => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const { user, chatList, setSidebarWidth, isPinned, setIsPinned} = useContext(Context)

    
    useEffect(()=>{
        const width = isExpanded || isPinned ? 256 :64;
        setSidebarWidth(width)

    },[isExpanded, isPinned, setSidebarWidth])

    const attemptToLogIn = ()=>{console.log('Se intentó loggear')}

    const togglePin = () => {
        setIsPinned(!isPinned)
    };

    const handleMouseEnter = () => {
        if (!isPinned) {
            setIsExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isPinned) {
            setIsExpanded(false);
        setOpenMenu(null);
        }
    };

    const toggleMenu = (menuName) => {
        if (openMenu === menuName) {
            setOpenMenu(null);
        } else {
            setOpenMenu(menuName);
        }
    };

    const chatsToggle = (index) => {
        console.log(`Cambiar al chat #${index}`);
        // Aquí usaré setChat(chatList[index]) más adelante
    };

    return (
        <div 
        className={`fixed left-0 top-0 h-screen bg-stone-300 dark:bg-gray-900 dark:text-gray-200 shadow-md transition-all duration-300 z-50 ${isExpanded || isPinned ? 'w-64' : 'w-16'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col h-full py-4">
                {/* Parte superior del sidebar */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between px-4 py-2 mb-4">
                            {/* Botón de menú (tres líneas) */}
                            <button 
                            className="p-2 rounded-md hover:bg-gray-400 hover:rounded-full"
                            onClick={togglePin}
                            title={isPinned ? 'Ocultar menú' : 'Mostrar menú'}
                            >
                                <i className="fa-solid fa-bars m-1"></i>
                            </button>
                            {/* Botón de búsqueda */}
                            {(isExpanded || isPinned) && (
                                <button 
                                className="p-2 rounded-md hover:bg-gray-400 hover:rounded-full"
                                title="Buscar"
                                >
                                    <i className="fa-solid fa-magnifying-glass m-1"></i>
                                </button>
                            )}
                            
                        </div>

                        {/* Botón de nueva conversación */}
                        <div 
                        className={`flex items-center px-4 py-2 mb-2 rounded-md cursor-pointer hover:bg-slate-400 transition-color ${!user && 'opacity-50 cursor-not-allowed'}`}
                        onClick={() => user && console.log('Crear nueva conversación')}
                        >
                            <i className="fa-regular fa-pen-to-square ml-3"></i>
                            {(isExpanded || isPinned) && (
                                <span className="ml-3">Nueva conversación</span>
                            )}
                        </div>

                        {/*Seccion Rebs, condicional según autenticación */}
                        {user && (
                            <div className='mt-4'>
                                {(isExpanded || isPinned) && (
                                    <div className="px-4 mb-4">
                                        <h3 className="text-xs uppercase text-gray-600 font-semibold mb-2">Rebs</h3>
                                        <div className="space-y-1">
                                            <div className="flex items-center py-1 rounded-md hover:bg-slate-300 cursor-pointer">
                                                <span className="ml-2">Storybook</span>
                                            </div>
                                            <div className="flex items-center py-1 rounded-md hover:bg-slate-300 cursor-pointer">
                                                <span className="ml-2">Descubrir</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="px-4 mt-6">
                            {(isExpanded || isPinned) && (
                                <h3 className="text-xs uppercase text-gray-600 font-semibold mb-2">Reciente</h3>
                            )}
                            {!user ? (
                                <>
                                    {(isExpanded || isPinned) && (
                                        <div 
                                        id='login-warning'
                                        className="bg-gray-400 p-4 rounded-lg">
                                            <p className="text-sm mb-3">Inicia sesión para empezar a guardar tus conversaciones. Una vez que hayas iniciado sesión, podrás acceder a tus conversaciones recientes aquí.</p>
                                            <button 
                                            className="px-2 text-left text-sm font-semibold text-blue-900 py-2 hover:bg-gray-500 hover:rounded-3xl transition-colors"
                                            onClick={attemptToLogIn}
                                            >
                                                Iniciar sesión
                                            </button>
                                        </div>
                                    )}
                                </>
                            ):(
                                <div>
                                    {chatList.map((item, index)=>{
                                        return(
                                            <div
                                            key={index}
                                            className="flex items-center justify-between relative py-2 rounded-md hover:bg-slate-300 cursor-pointer"
                                            >
                                                <div
                                                onClick={() => chatsToggle(index)}
                                                className="flex items-center truncate"
                                                >
                                                    {(isExpanded || isPinned) && (
                                                        <span className="ml-3">{item.slice(0,18)}</span>
                                                    )}
                                                </div>
                                                {(isExpanded || isPinned) && (
                                                    <button 
                                                    className="p-1 rounded-full hover:bg-slate-400"
                                                    onClick={() => toggleMenu(index+"menu")}
                                                    >
                                                        <i className="fa-solid fa-ellipsis-vertical px-2"></i>
                                                    </button>
                                                )}
                                                {/* Menú desplegable para Recientes */}
                                                {(isExpanded || isPinned) && openMenu === index+"menu" && (
                                                    <Menu />
                                                )}
                                            </div>
                                        )
                                    })}

                                    
                                </div>
                            )}
                        </div>
                    </div>

                {/* Parte inferior del sidebar */}
                <div className="mt-auto">
                    <div className="px-4 mb-4 space-y-2">
                        {!user && (
                            <>
                                <div className="flex items-center px-3 py-1 rounded-md hover:bg-slate-300 cursor-pointer">
                                    <i className="fa-brands fa-fulcrum w-4 text-2xl"></i>
                                    {(isExpanded || isPinned) && (
                                        <span className="ml-2">Aplicación</span>
                                    )}
                                </div>
                                <div className="flex items-center px-3 py-1 rounded-md hover:bg-slate-300 cursor-pointer">
                                    <i className="fa-regular fa-address-card"></i>
                                    {(isExpanded || isPinned) && (
                                        <span className="ml-2">Suscripciones</span>
                                    )}
                                </div>
                                <div className="flex items-center px-3 py-1 rounded-md hover:bg-slate-300 cursor-pointer">
                                    <i className="fa-regular fa-rectangle-list"></i>
                                    {(isExpanded || isPinned) && (
                                        <span className="ml-2">Para empresas</span>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="flex items-center px-3 py-1 rounded-md hover:bg-slate-300 cursor-pointer">
                            <i className="fa-solid fa-gear"></i>
                            {(isExpanded || isPinned) && (
                                <span className="ml-3">Ajustes y ayuda</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;