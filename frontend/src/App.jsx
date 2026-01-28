import { Routes, Route } from "react-router-dom";
import CreatePaste from "./pages/CreatePaste";
import ViewPaste from "./pages/ViewPaste";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePaste />} />
      <Route path="/p/:id" element={<ViewPaste />} />
    </Routes>
  );
}

export default App;
