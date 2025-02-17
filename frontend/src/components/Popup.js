import React from "react";

const Popup = ({ message, success }) => {
  return (
    <div className={`mt-4 p-4 w-80 text-center rounded-md ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {message}
    </div>
  );
};

export default Popup;


