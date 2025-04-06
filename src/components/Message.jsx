import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function MessagePage() {
  const { message } = useParams();
  const navigate = useNavigate();

  const [wishEvent, setWishEvent] = useState("");

  const whUrl = `https://api.whatsapp.com/send?text=${`${message} wishesh you Happy Navaratry ${`https://whats-app-msg-sender-5pvnut5hs-ashish-yadavs-projects-10d7c325.vercel.app`}`}`;

  useEffect(() => {
    if (message.length < 2) {
      navigate("/", { replace: true });
    }
  }, []);
  return (
    <>
      <section className="h-screen flex flex-col justify-center items-center gap-5">
        <div>Message Page</div>
        <section className="border rounded h-[400px] w-[400px] border-white">
          <img
            src="/assets/durga-maa.png"
            className=" h-[100%] w-[100%] object-contain "
          />
        </section>
        <p>{`${message} wishesh you Happy Navaratry`}</p>

        <a className="px-4 py-1 bg-red-600 rounded" href={whUrl}>
          Share on Whatsapp
        </a>
      </section>
    </>
  );
}

export default MessagePage;
