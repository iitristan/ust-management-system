import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import SignIn from "../pages/LoginPage";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function Logout() {
  const navigate = useNavigate();

  const logout = () => {
    googleLogout();
    navigate("/");
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Logout;
