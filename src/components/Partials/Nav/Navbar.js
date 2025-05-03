import classes from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import { toast } from 'react-toastify';

const endpoint = process.env.REACT_APP_RDS_END_POINT;

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const res = await axios.post(
        `${endpoint}/logout`,
        { refreshToken },
      );

      toast.success(res.data.message);

      localStorage.removeItem('token');
      localStorage.removeItem('expiryToken');
      localStorage.removeItem('refreshToken');

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
          {token && (<li><Button onClick={handleLogout} className={classes['btn-logout']}>Logout</Button></li>)}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
