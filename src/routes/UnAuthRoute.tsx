import {Navigate} from 'react-router-dom';
import {useAuthContext} from '../context/AuthContext';



type User = {
  name?: string | null,
  email?: string | null
}

//childrenには、ページが入る
const UnAuthRoute = ({children}: any) => {
  const user : User | undefined = useAuthContext();

  const isAuthenticated = user != null;
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default UnAuthRoute;
