import { useState, React } from "react";
import GalleryPage from "./components/GalleryPage/GalleryPage";
import Whpc from "./components/whpc/Whpc";
import { Routes, Route } from "react-router-dom";
// components
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";
import OsDogwalk from "./components/Os_dogwalk/OsDogwalk";
import OsDogrunning from "./components/Os_dogrun/OsDogrun";
import OsDogboarding from "./components/Os_dogboard/Os_dogboard";
import OsDogOn from "./components/Os_dogOn/OsDogOn";
import ReAskQue from "./components/ReAskQue/ReAskQue";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/whpc" element={<Whpc />} />
        <Route path="/OsDogwalk" element={<OsDogwalk />} />
        <Route path="/OsDogrunning" element={<OsDogrunning />} />
        <Route path="/OsDogboarding" element={<OsDogboarding />} />
        <Route path="/OsDogOn" element={<OsDogOn />} />
        <Route path="/ReAskQue" element={<ReAskQue />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
