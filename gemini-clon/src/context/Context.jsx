import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import main from "../config/gemini.js"
import { BASE_URL, createConversation, addMessage, getMessages } from "../services/api";

export const Context = createContext();

const ContextProvider = (props) => {

    const navigate = useNavigate();

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

    //Verificamos si ya hay un usuario loggeado
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser)); // ✅ guarda el objeto del usuario
        }
    }, []);

    //Obtenemos el listado de conversaciones desde el backend
    useEffect(() => {
        const fetchConversations = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${BASE_URL}/conversations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 401 || res.status === 403) {
                    throw new Error("Token expirado");
                }

                const data = await res.json();
                setChatList(data);
            } catch (error) {
                console.error("Error al cargar conversaciones:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                navigate('/'); // si tienes acceso a navigate aquí
            }
        };

        fetchConversations();

    }, [navigate]);

    //Crear una nueva conversación
    const startNewConversation = async () => {
        const newConversation = await createConversation("Nueva conversación");
        setChatList(prev => [...prev, newConversation]);
        setCurrentChat(chatList.length); // apunta al nuevo chat
        setChat([]); // limpia el historial
        setRecentPrompt("");
        setResultData("");
        setShowResult(true);
    };


    //Carga los mensajes de la actual conversación
    const loadChat = async (conversationId) => {
        const messages = await getMessages(conversationId);
        const formatted = messages.map(msg => ({
            role: msg.sender,
            parts: msg.content,
        }));
        setChat(formatted);
        setCurrentChat(chatList.findIndex(c => c.id === conversationId));
        setShowResult(true);
    };

    //Función para la animación que muestra la respuesta de la IA
    const delayData = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord)
        }, 75*index)
    }

    //Función que recibe el prompt del usuario y pide una respuesta de la API
    const onSent = async () => {
        //Verificamos que input no esté vacio
        if (!input.trim()) return;

        //Agregamos lo más reciente de la conversación a nuestro historial del chat en caso de que sea una conversación activa
        if (recentPrompt) {
            setChat(prev => [...prev, {role: 'user', parts:recentPrompt}]);
            setChat(prev => [...prev, {role:'ai', parts: resultData }]);
        } 
        
        //Iniciamos un nuevo cuadro con la animación loading
        setLoading(true)
        //Indicamos que se mostrara una conversación en caso de que no la hubiera antes
        setShowResult(true)
        //Guardamos el prompt del usuario
        setRecentPrompt(input)

        let conversationId = chatList[currentChat]?.id;

        // Si no hay conversación activa, crea una nueva
        let title = "Nueva conversación";
        if (!conversationId) {
            const { response, title: generatedTitle } = await main(chat, input, { generateTitle: true });
            title = generatedTitle || title;

            const newConversation = await createConversation(title);
            conversationId = newConversation.id;
            setChatList(prev => [...prev, newConversation]);
            setCurrentChat(chatList.length); // apunta al nuevo chat
            await addMessage(conversationId, "user", input);
            setChat([{ role: "user", parts: input }, { role: "ai", parts: response }]);
            await addMessage(conversationId, "ai", response);
            setResultData("");
            setInput("");
            //Animación para mostrar la respuesta
            let newResponse= response.split(" ");
            for (let i = 0; i < newResponse.length; i++) {
                const nextWord = newResponse[i];
                delayData(i,nextWord+" ")
            }
            setLoading(false);
            return;
        }

        // 🧠 Conversación ya existente
        await addMessage(conversationId, "user", input);
        setChat(prev => [...prev, { role: "user", parts: input }]);

        const { response } = await main(chat, input);
        await addMessage(conversationId, "ai", response);
        setChat(prev => [...prev, { role: "ai", parts: response }]);
        setResultData("");
        setInput("");
        
        //Animación para mostrar la respuesta
        let newResponse= response.split(" ");
        for (let i = 0; i < newResponse.length; i++) {
            const nextWord = newResponse[i];
            delayData(i,nextWord+" ")
        }
        
        setLoading(false);
    }

    //Estados para el diseño de la pagina
    const [sidebarWidth, setSidebarWidth] = useState(64); //Cambiará de acuerdo a los estados sel sidebar
    const [isPinned, setIsPinned] = useState(false); //Cambiara de acuerdo a los estados de sidebar
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        return stored ? JSON.parse(stored) : false;
    });
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)


    //Valores que mandaremos en el contexto
    const contextValue = {
        //Estado de validación de usuario 
        user,
        setUser,
        //Estados para el uso de la IA
        startNewConversation,
        loadChat,
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
        isSidebarHidden,
        setIsSidebarHidden,
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
