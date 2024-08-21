// LoginButton.js
import { GoogleLogin } from "react-google-login";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function LoginButton({ setIsLoggedIn }) {
  const onSuccess = (res) => {
    console.log("Login Success: currentUser:", res.profileObj);
    setIsLoggedIn(true);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    setIsLoggedIn(false);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
      isSignedIn={false}
    />
  );
}

export default LoginButton;
