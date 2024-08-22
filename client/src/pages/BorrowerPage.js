import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { Link, useNavigate } from "react-router-dom";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function BorrowerForm() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [material, setMaterial] = useState("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          clientId: clientId,
          scope: "",
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsLoggedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsLoggedIn);
        })
        .catch((error) => {
          console.error("Error initializing Google API:", error);
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      email,
      password,
      name,
      department,
      material,
      purpose,
    });
    // Add further logic here for form submission
  };

  return (
    <div className="flex h-screen">
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('./ust-image.JPG')" }}
      ></div>

      <div className="w-1/2 flex flex-col justify-center p-12 bg-white">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Admin Login</h1>
        <p className="text-lg text-gray-600 mb-8">
          Administrator Account for UST-OSA Asset Management System
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              className="block w-full border-b border-gray-300 bg-transparent text-lg text-gray-900 focus:border-indigo-500 focus:outline-none peer"
            />
            <label
              htmlFor="name"
              className="absolute left-0 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your name
            </label>
          </div>

          {/* Department Field */}
          <div className="relative">
            <input
              type="text"
              id="department"
              name="department"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder=" "
              className="block w-full border-b border-gray-300 bg-transparent text-lg text-gray-900 focus:border-indigo-500 focus:outline-none peer"
            />
            <label
              htmlFor="department"
              className="absolute left-0 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your department
            </label>
          </div>

          {/* Material Select Field */}
          <div className="relative">
            <select
              id="material"
              name="material"
              required
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="block w-full border-b border-gray-300 bg-transparent text-lg text-gray-900 focus:border-indigo-500 focus:outline-none"
            >
              <option value="" disabled>
                Select a material
              </option>
              <option value="Projector">Projector</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
            </select>
          </div>

          {/* Purpose Field */}
          <div className="relative">
            <textarea
              id="purpose"
              name="purpose"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder=" "
              className="block w-full border-b border-gray-300 bg-transparent text-lg text-gray-900 focus:border-indigo-500 focus:outline-none peer"
            />
            <label
              htmlFor="purpose"
              className="absolute left-0 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Purpose of borrowing
            </label>
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="block w-full border-b border-gray-300 bg-transparent text-lg text-gray-900 focus:border-indigo-500 focus:outline-none peer"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your email
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="block w-full border-b border-gray-300 bg-transparent text-lg text-gray-900 focus:border-indigo-500 focus:outline-none peer"
            />
            <label
              htmlFor="password"
              className="absolute left-0 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white text-lg font-medium py-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Submit Request
          </button>
        </form>

        {/* Back to Login */}
        <Link to="/" className="mt-6 text-indigo-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default BorrowerForm;
