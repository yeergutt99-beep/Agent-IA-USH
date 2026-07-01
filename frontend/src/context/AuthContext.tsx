import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
const AuthContext = createContext<{user:User|null; login:(e:string,p:string)=>Promise<void>; logout:()=>Promise<void>}>({user:null,login:async()=>{},logout:async()=>{}});
export function AuthProvider({children}:PropsWithChildren){ const [user,setUser]=useState<User|null>(null); useEffect(()=>onAuthStateChanged(auth,setUser),[]); return <AuthContext.Provider value={{user,login:async(e,p)=>{await signInWithEmailAndPassword(auth,e,p)},logout:()=>signOut(auth)}}>{children}</AuthContext.Provider>; }
export const useAuth=()=>useContext(AuthContext);
