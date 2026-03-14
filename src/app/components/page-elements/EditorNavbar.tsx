"use client"

import {User} from "@/app/models/User";
import {useEffect, useState} from "react";
import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";
import {useRouter} from "next/navigation";
import UserService from "@/app/services/UserService";
import Icon from "@/app/components/ui-elements/Icon";
import Link from "next/link";

export default function EditorNavbar() {

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        UserService.getMyUser().then((u) => {
            setUser(u)
        }).catch((e) => {
            // Do nothing, user is not logged in
        }).finally(() => setUserLoading(false))
    }, [])

    return (
        <nav className={"z-99 fixed top-0 left-0 right-0 w-full h-fit flex gap-3 items-center justify-end p-4 bg-linear-to-b from-background to-transparent"}>
            <NavbarItem>
                {userLoading ?
                    <LoadingIcon size={25}/> :
                    user ?
                    <Link href={user ? "https://account.maelg.fr/users/" + user.id : "https://account.maelg.fr/login"} target="_blank" rel="noopener noreferrer" className={"flex gap-2 items-center"}>
                        <p className={"pl-3"}>{user.first_name}</p>
                        <div className="p-2 bg-on-background rounded-full">
                            <Icon iconName={"user"} size={4}/>
                        </div>
                    </Link> :
                        <p className={"pl-3"}>You are not logged in</p>
                }
            </NavbarItem>
        </nav>
    )
}

function NavbarItem({children, onClick} : {children: React.ReactNode, onClick?: () => void}) {
    return (
        <div className=" p-1 flex items-center gap-2 transition-all rounded-full cursor-pointer border border-on-background bg-background hover:opacity-70 active:scale-90" onClick={onClick}>
            {children}
        </div>
    )
}