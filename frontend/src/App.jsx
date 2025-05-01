import React from "react";
import Form from "./components/Form";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        📧 Bulk Email Sender
      </h1>
      <Form />
    </div>
  );
};

export default App;
