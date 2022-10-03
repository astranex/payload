import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import Logo from '../../graphics/Logo';
import MinimalTemplate from '../../templates/Minimal';
import Form from '../../forms/Form';
import Email from '../../forms/field-types/Email';
import Password from '../../forms/field-types/Password';
import FormSubmit from '../../forms/Submit';
import Button from '../../elements/Button';
import Meta from '../../utilities/Meta';
import './index.scss';
const baseClass = 'login';
const Login = () => {
    const history = useHistory();
    const { user, setToken } = useAuth();
    const {
        admin: { user: userSlug, components: { beforeLogin, afterLogin } = {} },
        serverURL,
        routes: { admin, api },
        collections
    } = useConfig();
    const collection = collections.find(({ slug }) => slug === userSlug);
    const onSuccess = (data) => {
        if (data.token) {
            setToken(data.token);
            history.push(admin);
        }
    };
    if (user) {
        return React.createElement(
            MinimalTemplate,
            { className: baseClass },
            React.createElement(Meta, {
                title: 'Вход',
                description: 'Вход',
                keywords: 'Вход, Payload, CMS'
            }),
            React.createElement(
                'div',
                { className: `${baseClass}__wrap` },
                React.createElement('h1', null, 'Уже авторизованы'),
                React.createElement(
                    'p',
                    null,
                    'Чтобы войти в систему с другого аккаунта, вы должны',
                    ' ',
                    React.createElement(
                        Link,
                        { to: `${admin}/logout` },
                        'выйти'
                    )
                ),
                React.createElement('br', null),
                React.createElement(
                    Button,
                    { el: 'link', buttonStyle: 'secondary', to: admin },
                    'Вернуться в панель управления'
                )
            )
        );
    }
    return React.createElement(
        MinimalTemplate,
        { className: baseClass },
        React.createElement(Meta, {
            title: 'Вход',
            description: 'Вход',
            keywords: 'Вход, Payload, CMS'
        }),
        React.createElement(
            'div',
            { className: `${baseClass}__brand` },
            React.createElement(Logo, null)
        ),
        Array.isArray(beforeLogin) &&
            beforeLogin.map((Component, i) =>
                React.createElement(Component, { key: i })
            ),
        !collection.auth.disableLocalStrategy &&
            React.createElement(
                Form,
                {
                    disableSuccessStatus: true,
                    waitForAutocomplete: true,
                    onSuccess: onSuccess,
                    method: 'post',
                    action: `${serverURL}${api}/${userSlug}/login`
                },
                React.createElement(Email, {
                    label: 'Email',
                    name: 'email',
                    admin: { autoComplete: 'email' },
                    required: true
                }),
                React.createElement(Password, {
                    label: 'Пароль',
                    name: 'password',
                    autoComplete: 'off',
                    required: true
                }),
                React.createElement(
                    Link,
                    { to: `${admin}/forgot` },
                    'Забыли пароль?'
                ),
                React.createElement(FormSubmit, null, 'Войти')
            ),
        Array.isArray(afterLogin) &&
            afterLogin.map((Component, i) =>
                React.createElement(Component, { key: i })
            )
    );
};
export default Login;
