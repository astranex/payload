import React from 'react';

import './index.scss';

const Sticky = props => {
  return (
    <div className={`sticky${props.className ? ` ${props.className}` : ''}`}>
      {props.children}
    </div>
  );
}

export default Sticky;