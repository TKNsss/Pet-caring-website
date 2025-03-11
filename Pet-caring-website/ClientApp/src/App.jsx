import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import GalleryHeader from "./components/GalleryPage/GalleryHeader.jsx"
import PetService from "./components/GalleryPage/PetService.jsx";

function App() {

  return (
    <>
      <GalleryHeader />
      <PetService />
    </>
  );
}

export default App;
