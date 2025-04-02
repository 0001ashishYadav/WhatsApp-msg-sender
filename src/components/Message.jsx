import React from "react";
import { useParams } from "react-router";

function MessagePage() {
  const { message } = useParams();
  return (
    <>
      <div>Message Page</div>
      <p>{`${message} wishesh you Happy Navaratry`}</p>
    </>
  );
}

export default MessagePage;
