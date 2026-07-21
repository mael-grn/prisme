"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/app/models/User";
import UserService from "@/app/services/UserService";

interface UserContextType {
    user: User | null;
    userLoading: boolean;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setuserLoading] = useState(true);

    const fetchUser = async () => {
        setuserLoading(true);
        try {
            const res = await UserService.getMyUser();
            setUser(res);
        } catch (error) {
            setUser(null);
        } finally {
            setuserLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, userLoading, refreshUser: fetchUser }}>
    {children}
    </UserContext.Provider>
);
}

// 2. Création du custom hook pour consommer le contexte facilement
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser doit être utilisé à l'intérieur d'un UserProvider");
    }
    return context;
}