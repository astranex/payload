import React from 'react';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../utilities/Config';

import Eyebrow from '../../elements/Eyebrow';
import Card from '../../elements/Card';
import Button from '../../elements/Button';
import { Props } from './types';
import { Gutter } from '../../elements/Gutter';

import './index.scss';

const baseClass = 'dashboard';

const Dashboard: React.FC<Props> = (props) => {
  const {
    collections,
    globals,
    permissions,
  } = props;

  const { push } = useHistory();

  const {
    routes: {
      admin,
    },
    admin: {
      components: {
        afterDashboard,
        beforeDashboard,
      },
    },
  } = useConfig();

  return (
      <div className={baseClass}>
          <Eyebrow />
          <Gutter className={`${baseClass}__wrap`}>
              {Array.isArray(beforeDashboard) &&
                  beforeDashboard.map((Component, i) => <Component key={i} />)}
              <h2 className={`${baseClass}__label`}>Коллекции</h2>
              <ul className={`${baseClass}__card-list`}>
                  {collections.map((collection) => {
                      const hasCreatePermission =
                          permissions?.collections?.[collection.slug]?.create
                              ?.permission;

                      return (
                          <li key={collection.slug}>
                              <Card
                                  title={collection.labels.plural}
                                  id={`card-${collection.slug}`}
                                  onClick={() =>
                                      push({
                                          pathname: `${admin}/collections/${collection.slug}`
                                      })
                                  }
                                  actions={
                                      hasCreatePermission ? (
                                          <Button
                                              el="link"
                                              to={`${admin}/collections/${collection.slug}/create`}
                                              icon="plus"
                                              round
                                              buttonStyle="icon-label"
                                              iconStyle="with-border"
                                          />
                                      ) : undefined
                                  }
                              />
                          </li>
                      );
                  })}
              </ul>
              {globals.length > 0 && (
                  <React.Fragment>
                      <h2 className={`${baseClass}__label`}>Глобальные</h2>
                      <ul className={`${baseClass}__card-list`}>
                          {globals.map((global) => (
                              <li key={global.slug}>
                                  <Card
                                      title={global.label}
                                      onClick={() =>
                                          push({
                                              pathname: `${admin}/globals/${global.slug}`
                                          })
                                      }
                                  />
                              </li>
                          ))}
                      </ul>
                  </React.Fragment>
              )}
              {Array.isArray(afterDashboard) &&
                  afterDashboard.map((Component, i) => <Component key={i} />)}
          </Gutter>
      </div>
  );
};

export default Dashboard;
