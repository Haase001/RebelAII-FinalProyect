import { createContext, useState } from 'react';

export const Context = createContext();

const ContextProvider = (props) => {
    const [user, setUser] = useState(null); // ejemplo de estado global
    const [messages, setMessages] = useState([]); // ejemplo para el chat

    const contextValue = {
        user,
        setUser,
        messages,
        setMessages
    }
    return (
        <Context.Provider value={contextValue}>
        {props.children}
        </Context.Provider>
    );
}

export default ContextProvider
