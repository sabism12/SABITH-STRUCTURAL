import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/projects" element={<Navigate to="/#work" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
