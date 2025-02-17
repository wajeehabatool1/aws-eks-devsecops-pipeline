import React from "react";

const Registration = ({ name, email, setName, setEmail, registerUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-80">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <button
        onClick={registerUser}
        className="w-full bg-[#6b4226] text-white py-2 rounded-md hover:bg-[#8b5e34] transition-colors"
      >
        Register
      </button>
    </div>
  );
};

export default Registration;


