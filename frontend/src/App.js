import React, { useState } from "react";
import Registration from "./components/Registration";
import OrderForm from "./components/OrderForm";
import Popup from "./components/Popup";

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState({
    coffee_type: "Latte",
    size: "Medium",
    extras: [],
  });
  const [popup, setPopup] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const registerUser = async () => {
    try {
      console.log("Payload being sent:", { name, email });

      const response = await fetch(process.env.REACT_APP_CUSTOMER_SERVICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        const data = await response.json(); // Optionally handle response data
        setPopup({ message: "Registration Successful!", success: true });
      } else {
        setPopup({ message: "Registration Failed!", success: false });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setPopup({ message: "Registration Failed!", success: false });
    }
  };

  const placeOrder = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_ORDER_SERVICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: name,
          coffee_details: {
            coffee_type: order.coffee_type,
            size: order.size,
            extras: order.extras,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Optionally handle response data
        setPopup({ message: "Order Placed Successfully!", success: true });
      } else {
        setPopup({ message: "Order Failed!", success: false });
      }
    } catch (error) {
      console.error("Error during order placement:", error);
      setPopup({ message: "Order Failed!", success: false });
    }
  };

  const updateOrder = (key, value) => {
    setOrder((prevOrder) => ({ ...prevOrder, [key]: value }));
  };

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      setPopup(null); // Clear popup when switching sections
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen bg-amber-50 p-4">
      <h1 className="text-4xl font-bold text-[#6b4226] mb-8">Brew & Bliss</h1>
      
      <div className="flex gap-4 mb-8">
        <button
          className="bg-[#6b4226] text-white px-6 py-3 rounded-lg hover:bg-[#8b5e34] transition-colors"
          onClick={() => toggleSection("register")}
        >
          Register Yourself
        </button>
        <button
          className="bg-[#6b4226] text-white px-6 py-3 rounded-lg hover:bg-[#8b5e34] transition-colors"
          onClick={() => toggleSection("order")}
        >
          Order Your Coffee
        </button>
      </div>

      {activeSection === "register" && (
        <Registration
          name={name}
          email={email}
          setName={setName}
          setEmail={setEmail}
          registerUser={registerUser}
        />
      )}

      {activeSection === "order" && (
        <OrderForm
          order={order}
          updateOrder={updateOrder}
          placeOrder={placeOrder}
	  name={name}
	  setName={setName}
        />
      )}

      {popup && <Popup message={popup.message} success={popup.success} />}
    </div>
  );
};

export default App;

