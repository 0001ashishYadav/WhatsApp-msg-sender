import React, { useState } from "react";
import { useNavigate } from "react-router";

function HomePage() {
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  const formHandler = (e) => {
    e.preventDefault();
    navigate(`/${inputValue.toLowerCase()}`);
  };
  return (
    <div className="mx-auto max-w-2xs h-screen flex flex-col justify-center items-center pb-5 relative">
      <section className="border rounded h-[400px] w-[400px] border-white ">
        <img
          src="/assets/durga-maa.png"
          className=" h-[100%] w-[100%] object-contain"
        />
      </section>

      <form
        onSubmit={formHandler}
        className="px-5 py-2 border flex items-center gap-4 rounded bg-gray-500/15 absolute bottom-5 "
      >
        <input
          className="outline-none text-white font-semibold bg-gray-500/10 rounded pl-2 py-1 "
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          disabled={inputValue.length > 2 ? false : true}
          className={` rounded px-4 py-1 text-white font-semibold ${
            inputValue.length > 2 ? "bg-green-600" : "bg-red-600"
          }`}
        >
          send
        </button>
      </form>
    </div>
  );
}

export default HomePage;
