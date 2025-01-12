import React from 'react';
import { useConfig } from '../../utilities/Config';
import DefaultNav from '../../elements/Nav';
import RenderCustomComponent from '../../utilities/RenderCustomComponent';
import Meta from '../../utilities/Meta';
import { Props } from './types';

import './index.scss';

const baseClass = 'template-default';

const Default: React.FC<Props> = ({ children, className }) => {
  const {
    admin: {
      components: {
        Nav: CustomNav,
      } = {
        Nav: undefined,
      },
    } = {},
  } = useConfig();

  const classes = [
    baseClass,
    className,
  ].filter(Boolean).join(' ');

  return (
      <div className={classes}>
          <Meta
              title="Панель управления"
              description="Панель управления Payload CMS"
              keywords="Панель управления, Payload, CMS"
          />
          <RenderCustomComponent
              DefaultComponent={DefaultNav}
              CustomComponent={CustomNav}
          />
          <div className={`${baseClass}__wrap`}>{children}</div>
      </div>
  );
};

export default Default;
