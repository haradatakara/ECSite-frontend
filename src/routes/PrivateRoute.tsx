import { useAuthContext } from "../context/AuthContext";
import SignInSide from "../pages/SignIn";
import { Footer } from "../templates/Footer";
import Header from "../templates/Header";

type User = {
  name?: string | null;
  email?: string | null;
};

//childrenには、ページが入る
const PrivateRoute = ({ children }: any) => {
  const user: User | undefined = useAuthContext();
  const isAuthenticated = user != null;
  return isAuthenticated ? (
    <>
      <Header />
      {children}
      <Footer />
    </>
  ) : (
    <SignInSide />
  );
};

export default PrivateRoute;
