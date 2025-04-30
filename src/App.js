import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/view';
import Login from './components/Login/view';
import Navbar from './components/Partials/Nav/Navbar';
import CreateUser from './components/Users/CreateUser/view';
import UserDetail from './components/Users/UserDetail/view';
import UserList from './components/Users/UserList/view';
import Logs from './components/Logs/LogList/view';
import ValidateRoute from './components/ValidateRoute/ValidateRoute';
import ResetPasswordForm from './components/ResetPasswordForm/view';
import ChangePassword from './components/ChangePassword/view';
import SessionTimeout from './components/SessionTimeout/SessionTimeout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <Router>
      <SessionTimeout />
      <div>
        <Navbar />

        <Routes>
          <Route path="/" exact element={
            <ValidateRoute><Home /></ValidateRoute>
          } />
          <Route path="/users" element={
            <ValidateRoute><UserList /></ValidateRoute>
          } />
          <Route path="/users/create" element={
            <ValidateRoute><CreateUser /></ValidateRoute>
          } />
          <Route path="/users/:userCode/edit" element={
            <ValidateRoute><UserDetail /></ValidateRoute>
          } />
          <Route path="/users/me" element={
            <ValidateRoute><UserDetail isMe={true}/></ValidateRoute>
          } />
          <Route path="/logs" element={
            <ValidateRoute><Logs /></ValidateRoute>
          } />
          <Route path="/login" element={<Login/>} />
          <Route path="/users/reset-password" element={<ResetPasswordForm/>} />
          <Route path="/users/change-password" element={<ValidateRoute><ChangePassword/></ValidateRoute>} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
