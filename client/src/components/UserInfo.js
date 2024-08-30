import { useState } from "react";
import PropTypes from "prop-types";

const UserInfo = ({ className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Vince Albert Juson");
  const [email, setEmail] = useState("vincejuson@ust.edu.ph");
  const [contact, setContact] = useState("09951778731");

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Logic to save the updated information
  };

  return (
    <div
      className={`self-stretch bg-[#fff] flex flex-col items-center justify-center pt-6 px-12 pb-6 box-border gap-6 max-w-full z-1 mt-[-6px] text-center text-xl text-[#4b4b4b] font-[Poppins] h-auto ${className}`}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base font-bold text-[#4b4b4b] border border-gray-300 p-1 rounded-md w-full max-w-xs text-center"
            />
          ) : (
            <h3 className="text-2xl font-bold text-[#4b4b4b]">
              {name}
            </h3>
          )}
          <div className="text-base text-[#787486] mt-1">
            Student
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#4b4b4b] mb-1">
            Email
          </h3>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-base border border-gray-300 p-1 rounded-md w-full max-w-xs text-center"
            />
          ) : (
            <p className="text-lg">{email}</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#4b4b4b] mb-1">
            Contact
          </h3>
          {isEditing ? (
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="text-base border border-gray-300 p-1 rounded-md w-full max-w-xs text-center"
            />
          ) : (
            <p className="text-lg">{contact}</p>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="bg-[#4e4e4e] text-white py-2 px-4 rounded-md"
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

UserInfo.propTypes = {
  className: PropTypes.string,
};

export default UserInfo;
