import { createContext, useState } from 'react';
import main from "../config/gemini.js"

export const Context = createContext();

const ContextProvider = (props) => {

    const [user, setUser] = useState(false);

    //Estados para el uso de la IA
    const [currentChat, setCurrentChat] = useState(0); //Estado que indica que chat se va a mostrar el el chat
    const [chat, setChat] = useState([]); //Estado que despliega el historial del chat que se desplegó
    const [chatList, setChatList] = useState([]); //Estado que guardará el listado de los chats que se generen
    const [input, setInput] = useState("");  //Estado que guarda el prompt del usuario
    const [recentPrompt, setRecentPrompt] = useState(""); //Estado que guarda El prompt mas reciente desplegado
    const [showResult, setShowResult] = useState(false); //Estado que nos indica si se muestra la pantalla principal o un chat
    const [loading, setLoading] = useState(false); //Estado que carga la animación de carga mientras se espera por una respuesta
    const [resultData, setResultData] = useState(""); //Estado que muestra la respuesta más reciente

    
    //Función para la animación que muestra la respuesta de la IA
    const delayData = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord)
        }, 75*index)
    }

    //Función que recibe el prompt del usuario y pide una respuesta de la API
    const onSent = async () => {
        
        //Agregamos lo más reciente de la conversación a nuestro historial del chat en caso de que sea una conversación activa
        if (recentPrompt) {
            setChat(prev => [...prev, {from: 'user', text:recentPrompt}]);
            setChat(prev => [...prev, {from:'ai', text: resultData }]);
        } 
        
        //Borramos el estado de la última respuesta del la IA
        setResultData("");
        //Iniciamos un nuevo cuadro con la animación loading
        setLoading(true)
        //Indicamos que se mostrara una conversación en caso de que no la hubiera antes
        setShowResult(true)

        //Guardamos el prompt del usuario
        setRecentPrompt(input)

        //Esperamos una respuesta de la IA y la guardamos en una constante
        const response = await main(input)
        
        //Borramos el prompt actual
        setInput("")

        //Animación para mostrar la respuesta
        let newResponse= response.split(" ");
        for (let i = 0; i < newResponse.length; i++) {
            const nextWord = newResponse[i];
            delayData(i,nextWord+" ")
        }

        //Quitamos la animacíon de loading
        setLoading(false)

    }

    //Estados para el diseño de la pagina
    const [sidebarWidth, setSidebarWidth] = useState(64); //Cambiará de acuerdo a los estados sel sidebar
    const [isPinned, setIsPinned] = useState(false); //Cambiara de acuerdo a los estados de sidebar
    const [darkMode, setDarkMode] = useState(false);


    //Valores que mandaremos en el contexto
    const contextValue = {
        //Estado de validación de usuario 
        user,
        setUser,
        //Estados para el uso de la IA
        onSent,
        chat,
        setChat,
        chatList, 
        setChatList,
        currentChat,
        setCurrentChat,
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        showResult,
        setShowResult,
        loading,
        setLoading,
        resultData,
        setResultData,
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
