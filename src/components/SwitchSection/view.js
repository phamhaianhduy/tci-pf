import classes from './SwitchSection.module.css';

const SwitchSection = ({onChangeSection}) => {
  return (
    <div className={classes['extra-actions']}>
       <span className={classes['link']} onClick={() => onChangeSection('login')}>
        Login
      </span>
      <span className={classes['divider']}>|</span>
      <span className={classes['link']} onClick={() => onChangeSection('forgot')}>
        Forgot password?
      </span>
    </div>
  );
};

export default SwitchSection;
