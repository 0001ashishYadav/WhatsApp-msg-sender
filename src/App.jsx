import { Route, Routes } from "react-router";
import HomePage from "./components/Home";
import MessagePage from "./components/Message";
import NotFoundPage from "./components/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:message" element={<MessagePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
