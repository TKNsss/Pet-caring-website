import { React, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// components
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";
import { ToastContainer, Flip } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./redux/features/users/usersSlice";

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
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Login />} />
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
      />
    </>
  );
};

export default App;
