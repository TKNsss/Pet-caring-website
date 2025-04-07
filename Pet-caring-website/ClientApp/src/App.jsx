import { React, useEffect } from "react";
import Modal from "react-modal";

// Required: Bind modal to your root app element
Modal.setAppElement('#root'); // ID from index.html

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
import { ToastContainer, Flip } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./redux/features/users/usersSlice";
import UserProfile from "./components/UserProfile/UserProfile";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  return (
    <>
      <Routes>
        {/* Main navigation with nested routes */}
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="about">
            <Route path="why-choose-us" element={<Whpc />} />
            <Route path="gallery" element={<GalleryPage />} />
          </Route>

          <Route path="Os">
            <Route path="dogwalk" element={<OsDogwalk />} />
            <Route path="dogrunning" element={<OsDogrunning />} />
            <Route path="dogboarding" element={<OsDogboarding />} />
            <Route path="dogon" element={<OsDogOn />} />
          </Route>
          <Route path="ReAskQue" element={<ReAskQue />} />
        </Route>

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* User profile */}
        <Route path="/user/profile" element={<UserProfile />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* toast - display notifications */}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
        toastStyle={{ backgroundColor: "#f1f1f1" }}
      />
    </>
  );
};

export default App;
