import React, { useState } from "react";
import { useNavigate } from "react-router";

function HomePage() {
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  const formHandler = (e) => {
    e.preventDefault();
    navigate(`/${inputValue}`);
  };
  return (
    <div className="mx-auto max-w-2xs h-screen flex items-end pb-5 ">
      <form
        onSubmit={formHandler}
        className="px-5 py-2 border flex items-center gap-4 rounded bg-gray-500/15"
      >
        <input
          className="outline-none text-white font-semibold"
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          disabled={inputValue ? false : true}
          className={` rounded px-4 py-1 text-white font-semibold ${
            inputValue ? "bg-green-600" : "bg-red-600"
          }`}
        >
          send
        </button>
      </form>
    </div>
  );
}

export default HomePage;
