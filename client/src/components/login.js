// LoginButton.js
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Dashboard from "../pages/DashboardPage";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function LoginButton({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const onSuccess = (res) => {
    console.log("Login Success: currentUser:", res.profileObj);
    setIsLoggedIn(true);

    navigate("/Dashboard");
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    setIsLoggedIn(false);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={false}
      />
    </GoogleOAuthProvider>
  );
}

export default LoginButton;
