// import { GoogleLogin } from "react-google-login";
// import { useNavigate } from "react-router-dom";

// const clientId =
//   "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

// function Login() {
//   const navigate = useNavigate();

//   const onSuccess = (res) => {
//     console.log("Login Success: currentUser:", res.profileObj);
//     var profile = res.getBasicProfile();
//     console.log("ID: " + profile.getId()); // Don't send this directly to your server!
//     console.log("Full Name: " + profile.getName());
//     console.log("Given Name: " + profile.getGivenName());
//     console.log("Family Name: " + profile.getFamilyName());
//     console.log("Image URL: " + profile.getImageUrl());
//     console.log("Email: " + profile.getEmail());

//     var id_token = res.getAuthResponse().id_token;
//     console.log("ID Token: " + id_token);

//     navigate("/Dashboard");
//   };

//   const onFailure = (res) => {
//     console.log("Login failed: res:", res);
//   };

//   return (
//     <div>
//       <GoogleLogin
//         clientId={clientId}
//         buttonText="Login"
//         onSuccess={onSuccess}
//         onFailure={onFailure}
//         cookiePolicy={"single_host_origin"}
//         style={{ marginTop: "100px" }}
//         isSignedIn={false}
//       />
//     </div>
//   );
// }

// export default Login;


// import { useEffect } from "react";
// import { gapi } from "gapi-script";

// const clientId =
//   "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

// function Dashboard() {
//   useEffect(() => {
//     function start() {
//       gapi.client.init({
//         clientId: clientId,
//         scope: "",
//       });
//     }

//     gapi.load("client:auth2", start);
//   });

//   return (
//     <div className="Dashboard">
//       <header className="App-header">
//         <h1>ok</h1>
//         <p>
//           SHESH
//         </p>
//       </header>
//     </div>
//   );
// }

// export default Dashboard;
