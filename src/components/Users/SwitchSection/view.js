import classes from './SwitchSection.module.css';
import { useState } from 'react';

const SwitchSection = ({onChangeSection}) => {
  return (
    <div className={classes['extra-actions']}>
       <span className={classes['link']} onClick={() => onChangeSection('login')}>
        Change password
      </span>
    </div>
  );
};

export default SwitchSection;
