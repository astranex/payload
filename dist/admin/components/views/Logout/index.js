import React, { useEffect } from 'react';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import Minimal from '../../templates/Minimal';
import Button from '../../elements/Button';
import Meta from '../../utilities/Meta';
import './index.scss';
const baseClass = 'logout';
const Logout = (props) => {
    const { inactivity } = props;
    const { logOut } = useAuth();
    const {
        routes: { admin }
    } = useConfig();
    useEffect(() => {
        logOut();
    }, [logOut]);
    return React.createElement(
        Minimal,
        { className: baseClass },
        React.createElement(Meta, {
            title: 'Выход из системы',
            description: 'Выход из системы',
            keywords: 'Выход из системы, Payload, CMS'
        }),
        React.createElement(
            'div',
            { className: `${baseClass}__wrap` },
            inactivity &&
                React.createElement(
                    'h2',
                    null,
                    'Вы вышли из системы из-за неактивности.'
                ),
            !inactivity &&
                React.createElement('h2', null, 'Вы успешно вышли из системы.'),
            React.createElement('br', null),
            React.createElement(
                Button,
                {
                    el: 'anchor',
                    buttonStyle: 'secondary',
                    url: `${admin}/login`
                },
                'Войти снова'
            )
        )
    );
};
export default Logout;
