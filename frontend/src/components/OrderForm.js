import React from "react";

const OrderForm = ({ order, updateOrder, placeOrder, name, setName }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-80">
      <h2 className="text-2xl font-semibold mb-4">Order Coffee</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <select
        onChange={(e) => updateOrder("coffee_type", e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      >
        <option value="Latte">Latte</option>
        <option value="Cappuccino">Cappuccino</option>
        <option value="Espresso">Espresso</option>
      </select>
      <select
        onChange={(e) => updateOrder("size", e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      >
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
      </select>
      <input
        type="text"
        placeholder="Extras (comma-separated)"
        onChange={(e) =>
          updateOrder("extras", e.target.value.split(",").map((extra) => extra.trim()))
        }
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <button
        onClick={placeOrder}
        className="w-full bg-[#6b4226] text-white py-2 rounded-md hover:bg-[#8b5e34] transition-colors"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderForm;


