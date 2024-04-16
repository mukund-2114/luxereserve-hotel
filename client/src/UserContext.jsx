import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const UserContext = createContext({ });

export function UserContextProvider({children}){
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)
    useEffect(()=>{
                if(!user){
                    axios.get('/profile').then((response)=>{
                        setUser(response.data);
                        setReady(true)
                    })
                }
    },[])
    return(
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    )
}
