import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login/view";
import Navbar from "./components/Partials/Nav/Navbar";
import CreateUser from "./components/Users/CreateUser/view";
import UserDetail from "./components/Users/UserDetail/view";
import UserList from "./components/Users/UserList/view";
import Logs from "./components/Logs/LogList/view";
import ValidateRoute from "./components/ValidateRoute/ValidateRoute";
import ResetPasswordForm from "./components/ResetPasswordForm/view";
import ChangePassword from "./components/ChangePassword/view";
import IdleSessionHandler  from "./components/IdleSessionHandler/IdleSessionHandler";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadingStore } from "./stores/LoadingStore";
import { observer } from "mobx-react-lite";
import { Spinner } from "react-bootstrap";
import { useEffect } from "react";
import { userStore } from "./stores/UserStore";

function App() {
  useEffect(() => {
    const getUserByMe = async () => {
      await userStore.getUserByMe();
    }
    getUserByMe();
  }, []);

  return (
    <Router>
      {loadingStore.isLoading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" className="loading-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <IdleSessionHandler  />
      <div>
        <Navbar />

        <Routes>
          <Route 
            path="/"
            element={
              userStore.userDetailByMe ? <Navigate to="/users/me" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/users"
            element={
              <ValidateRoute>
                <UserList />
              </ValidateRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <ValidateRoute>
                <CreateUser />
              </ValidateRoute>
            }
          />
          <Route
            path="/users/:userCode/edit"
            element={
              <ValidateRoute>
                <UserDetail />
              </ValidateRoute>
            }
          />
          <Route
            path="/users/me"
            element={
              <ValidateRoute>
                <UserDetail isMe={true} />
              </ValidateRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ValidateRoute>
                <Logs />
              </ValidateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/users/reset-password" element={<ResetPasswordForm />} />
          <Route
            path="/users/change-password"
            element={
              <ValidateRoute>
                <ChangePassword />
              </ValidateRoute>
            }
          />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}

export default observer(App);
