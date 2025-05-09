import classes from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { authStore } from '../../../stores/AuthStore';
import { observer } from 'mobx-react-lite';
import { userStore } from '../../../stores/UserStore';
import { UserRound } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await authStore.logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.error.message);
    }
  }
  return (
    <div>
      <nav className={classes.navbar}>
        <ul className={classes['nav-links']}>
          <li>
            <a href='/'>Home</a>
          </li>

          <li className={classes.dropdown}>
            <a href='/users' className={classes['dropbtn']}>
              Users
            </a>
            <div className={classes['dropdown-content']}>
              <a href='/users'>List</a>
              <a href='/users/create'>Create</a>
            </div>
          </li>

          <li>
            <a href='/logs'>Logs</a>
          </li>
          {!token && (<li><a href='/login'>Login</a></li>)}

          {token && (
            <li className={classes.dropdown}>
              <a href='/users/me' className={classes['dropbtn']}>
                <UserRound strokeWidth={1.5} />
              </a>
              <div className={classes['dropdown-content']}>
                <a href='/users/me'>Profile</a>
                <button onClick={handleLogout} className={classes['btn-logout']}>Logout</button>
              </div>
            </li>
          )}

        </ul>
      </nav>
    </div>
  );
}

export default observer(Navbar);
