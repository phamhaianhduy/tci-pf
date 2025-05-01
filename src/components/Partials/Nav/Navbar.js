import classes from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryToken');
    navigate('/login');
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
          {token && (<li><Button onClick={handleLogout} variant='warning'>Logout</Button></li>)}
        </ul>
      </nav>
      {/* <nav>
        <ul>
          <li>Xin chào</li>
          <li>Logout</li>
        </ul>
      </nav> */}
    </div>
  );
};

export default Navbar;
