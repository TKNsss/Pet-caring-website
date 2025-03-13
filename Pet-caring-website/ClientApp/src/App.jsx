import { useState, React } from "react";
import GalleryHeader from "./components/GalleryPage/GalleryHeader.jsx";
import PetService from "./components/GalleryPage/PetService.jsx";

import { Routes, Route } from "react-router-dom";
// components
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="/gallery" element={<GalleryHeader />} />

        <Route path="/gallery" element={<PetService />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
