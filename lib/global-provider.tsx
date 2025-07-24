import {createContext, useContext, ReactNode} from "react";
import {getCurrentUser} from "@/lib/appwrite";
import {useAppwrite} from "@/lib/useAppwrite";


interface GlobalContextType {
    isLogged: boolean;
    user: User | null;
    loading: boolean;
    refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

interface User {
    $id: string;
    name: string;
    email: string;
    avatar: string;
}

interface GlobalProviderProps {
    children: ReactNode;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const { data: user, loading, refetch } = useAppwrite({ fn: getCurrentUser, });

    const isLogged = !!user;

    // console.log(JSON.stringify(user))

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                user,
                loading,
                refetch: async (newParams = {}) => await refetch(newParams)
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be within a GlobalProvider");
    }

    return context;
};

export default GlobalProvider;