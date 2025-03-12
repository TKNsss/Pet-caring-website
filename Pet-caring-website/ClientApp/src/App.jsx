import React from "react";

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
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
