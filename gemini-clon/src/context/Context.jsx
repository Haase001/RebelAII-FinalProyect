import { createContext, useState } from 'react';

export const Context = createContext();

const ContextProvider = (props) => {
    
    const [user, setUser] = useState(false);
    const [chat, setChat] = useState([]); //Aqui se guardará el historial del chat actual
    const [chatList, setChatList] = useState([]) //Aqui guardaremos el listado de los chats que se generen

    //Estados para el diseño de la pagina
    const [sidebarWidth, setSidebarWidth] = useState(64); //Cambiará de acuerdo a los estados sel sidebar
    const [isPinned, setIsPinned] = useState(false); //Cambiara de acuerdo a los estados de sidebar
    const [darkMode, setDarkMode] = useState(false);

    const contextValue = {
        user,
        setUser,
        chat,
        setChat,
        chatList, 
        setChatList,
        //Estados de diseño de página
        sidebarWidth,
        setSidebarWidth,
        isPinned,
        setIsPinned,
        darkMode,
        setDarkMode
    }
    return (
        <Context.Provider value={contextValue}>
        {props.children}
        </Context.Provider>
    );
}

export default ContextProvider
