import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import MinimalTemplate from '../../templates/Minimal';
import Form from '../../forms/Form';
import Email from '../../forms/field-types/Email';
import FormSubmit from '../../forms/Submit';
import Button from '../../elements/Button';
import Meta from '../../utilities/Meta';
import './index.scss';
const baseClass = 'forgot-password';
const ForgotPassword = () => {
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { user } = useAuth();
    const {
        admin: { user: userSlug },
        serverURL,
        routes: { admin, api }
    } = useConfig();
    const handleResponse = (res) => {
        res.json().then(
            () => {
                setHasSubmitted(true);
            },
            () => {
                toast.error('Предоставленный email недействительный.');
            }
        );
    };
    if (user) {
        return React.createElement(
            MinimalTemplate,
            { className: baseClass },
            React.createElement(Meta, {
                title: 'Забыли пароль',
                description: 'Забыли пароль',
                keywords: 'Забыли, Пароль, Payload, CMS'
            }),
            React.createElement('h1', null, 'Вы уже вошли в систему'),
            React.createElement(
                'p',
                null,
                'Чтобы сменить свой пароль, перейдите на свой',
                ' ',
                React.createElement(
                    Link,
                    { to: `${admin}/account` },
                    'аккаунт'
                ),
                ' ',
                'и отредактируйте свой пароль там.'
            ),
            React.createElement('br', null),
            React.createElement(
                Button,
                { el: 'link', buttonStyle: 'secondary', to: admin },
                'Вернуться в панель управления'
            )
        );
    }
    if (hasSubmitted) {
        return React.createElement(
            MinimalTemplate,
            { className: baseClass },
            React.createElement('h1', null, 'Письмо отправлено'),
            React.createElement(
                'p',
                null,
                'Проверьте свою электронную почту на наличие письма с ссылкой, которая позволит вам безопасно сбросить свой пароль.'
            )
        );
    }
    return React.createElement(
        MinimalTemplate,
        { className: baseClass },
        React.createElement(
            Form,
            {
                handleResponse: handleResponse,
                method: 'post',
                action: `${serverURL}${api}/${userSlug}/forgot-password`
            },
            React.createElement('h1', null, 'Забыли пароль'),
            React.createElement(
                'p',
                null,
                'Пожалуйста, введите свой адрес электронной почты ниже. Вы получите электронное письмо с инструкциями о том, как сбросить свой пароль'
            ),
            React.createElement(Email, {
                label: 'Email',
                name: 'email',
                admin: { autoComplete: 'email' },
                required: true
            }),
            React.createElement(FormSubmit, null, 'Отправить')
        ),
        React.createElement(
            Link,
            { to: `${admin}/login` },
            'Вернуться к авторизации'
        )
    );
};
export default ForgotPassword;
