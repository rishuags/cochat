import { createContext, useContext, useState } from "react";

const ApiKeyContext = createContext(); //Create Context

//Provider Component
export function ApiKeyProvider({ children }) {
    const [apiKey, setApiKey] = useState("");

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
}

// Custom hook to use in components
export function useApiKey() {
    const context = useContext(ApiKeyContext);
    if (!context) {
        throw new Error("useApiKey must be used with an ApiKeyProvider");
    }
    return context;
}