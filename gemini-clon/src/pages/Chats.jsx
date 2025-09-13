import { useRef, useEffect, useContext } from 'react';
import { Context } from '../context/Context.jsx';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm';

const Chats = () => {
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const { onSent, chat, recentPrompt, showResult, loading, resultData, setInput, input, sidebarWidth, isPinned , darkMode } = useContext(Context);

    // Efecto para hacer scroll al final cuando hay nuevos mensajes
    useEffect(() => {
        scrollToBottom();
    }, [resultData, darkMode]);

    //Guardamos el with del sidebar para usarlo en nuestro componente
    const width = `${sidebarWidth}px`

    //Función para mostrar lo último de la convesación al recibir una respuesta de la IA
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    //Funcion para pedir una respuesta de la IA
    const handleSendMessage = async () =>{
        if (input.trim() === '') return;
        await onSent();
    }

    //Función para manejar la tecla ENTER
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div 
        id='dashboard'
        className="flex flex-col items-center h-full bg-white dark:bg-gray-950 dark:text-gray-200 overflow-hidden"
        style={!isPinned ? ({marginLeft: "64px"}) : ({marginLeft: width})}
        >
            {/* Área de mensajes */}
            <div 
            ref={chatContainerRef}
            className="flex-1 flex justify-center w-full overflow-y-auto transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
            >
                <div 
                className='flex justify-center p-4' 
                id='chatContainer'
                >
                    {!showResult ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <h2 className="text-6xl text-center font-medium">Descubre Rebel, tu asistente de IA personal</h2>
                        </div>
                    ) : (
                        <div className="space-y-4 w-full h-full">
                            {chat.map((interaction, index)=>{
                                return(
                                    <div 
                                    className={`flex ${interaction.role === "user" ? "justify-end": "justify-start" }`}
                                    key={index+interaction.role}
                                    >
                                        {interaction.role === "user" ? (
                                            <>
                                                <div className='flex max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl rounded-tr-sm p-3     bg-slate-400'>
                                                    <span className="break-words mt-1">
                                                        <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        >
                                                            {DOMPurify.sanitize(interaction.parts)}
                                                        </ReactMarkdown>
                                                    </span>
                                                </div>
                                            </>
                                        ):(
                                            <>
                                                <div className='flex max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-xl p-3 dark:bg-gray-950 bg-white h-fit'>
                                                    <span className="text-2xl text-blue-500">
                                                        <i className="fa-brands fa-fulcrum mr-3"></i>
                                                    </span>
                                                    <div className='flex flex-wrap result-data w-full'>
                                                        <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        >
                                                            {DOMPurify.sanitize(interaction.parts)}
                                                        </ReactMarkdown>
                                                        <div ref={messagesEndRef} />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                            <div className='flex justify-end' >
                                <div className='flex max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl rounded-tr-sm p-3 bg-slate-400'>
                                    <span className="break-words mt-1">{recentPrompt}</span>
                                </div>
                            </div>
                            <div className='flex justify-start' >
                                <div className='flex max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-xl p-3 dark:bg-gray-950'>
                                    <span className={`text-2xl text-blue-500 ${loading ? "rounded-full animation" : ""}`}>
                                        <i className={`fa-brands fa-fulcrum  ${!loading ? "mr-3": "rounded-full bg-white dark:bg-gray-950 py-1 px-2"} `}></i>
                                    </span>
                                    {loading ? (
                                        <span className='mt-1'></span>
                                        ):(
                                            <div className='result-data'>
                                                <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                >
                                                    {DOMPurify.sanitize(resultData)}
                                                    
                                                </ReactMarkdown>
                                                <div ref={messagesEndRef} />
                                            </div>
                                        ) }
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Área de entrada de texto */}
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-950 dark:text-gray-200 p-4 w-full">
                <div 
                className="flex items-center border border-gray-300 rounded-3xl py-2 px-4 items-center m-2"
                id='text-container'
                >
                    <button className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 transition-colors mr-2">
                        <i className="fa-solid fa-plus font-light"></i>
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                        id='input-container'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Pregunta a Rebel"
                        className="w-full py-2 px-4 pr-10 mt-1 resize-none dark:bg-gray-800 focus:outline-none focus:ring-none focus:border-transparent"
                        rows="1"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                        />
                    </div>

                    <button
                    onClick={handleSendMessage}
                    disabled={input.trim() === ''}
                    className={`py-1 px-2 rounded-full ml-2 transition-colors dark:bg-gray-800 dark:text-gray-200 ${input.trim() === '' ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'} ${loading ? 'animate-pulse' : ''}`}
                    >
                        ➤
                    </button>
                </div>
        
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">Se aplican términos y condiciones</p>
                </div>
            </div>
        </div>
    );
}

export default Chats