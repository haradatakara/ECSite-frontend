import {useState} from 'react';
import {createContext, useContext} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {useEffect} from 'react';
import {firebaseApp} from '../firebase';

type User = {
    name?: string | null,
    email?: string | null
} 


const AuthContext = createContext<User | undefined>(undefined);
const auth = firebaseApp.auth;

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({children}: any) {

  const [user, setUser] = useState<User>();

  const value: User | undefined = user;
  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      return user ? setUser({name : user.displayName, email: user.email}) : undefined;
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
