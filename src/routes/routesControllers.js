import { Navigate } from "react-router-dom";
import { selectAuthorization } from "../redux/selectors/selectors";
import { useSelector } from "react-redux";

export const StoreRoutesController = ({ children }) => {
  const isAuthenticated = useSelector(selectAuthorization);

  return isAuthenticated.isLoggedIn && isAuthenticated.role === "store" ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

// export const AdminRoutesController = ({ children }) => {
//   const isAuthenticated = useSelector(selectAuthorization);

//   return isAuthenticated.isLoggedIn && isAuthenticated.role === "admin" ? (
//     children
//   ) : (
//     <Navigate to="/" />
//   );
// };
