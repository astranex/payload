import React from 'react';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import MinimalTemplate from '../../templates/Minimal';
import Meta from '../../utilities/Meta';
import Form from '../../forms/Form';
import RenderFields from '../../forms/RenderFields';
import fieldTypes from '../../forms/field-types';
import FormSubmit from '../../forms/Submit';
import './index.scss';
const baseClass = 'create-first-user';
const CreateFirstUser = (props) => {
    const { setInitialized } = props;
    const { setToken } = useAuth();
    const {
        admin: { user: userSlug },
        collections,
        serverURL,
        routes: { admin, api }
    } = useConfig();
    const userConfig = collections.find(
        (collection) => collection.slug === userSlug
    );
    const onSuccess = (json) => {
        var _a;
        if (
            (_a = json === null || json === void 0 ? void 0 : json.user) ===
                null || _a === void 0
                ? void 0
                : _a.token
        ) {
            setToken(json.user.token);
        }
        setInitialized(true);
    };
    const fields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true
        },
        {
            name: 'password',
            label: 'Пароль',
            type: 'password',
            required: true
        },
        {
            name: 'confirm-password',
            label: 'Подтверждение пароля',
            type: 'confirmPassword',
            required: true
        }
    ];
    return React.createElement(
        MinimalTemplate,
        { className: baseClass },
        React.createElement('h1', null, 'Добро пожаловать!'),
        React.createElement(
            'p',
            null,
            'Для начала создайте своего первого пользователя.'
        ),
        React.createElement(Meta, {
            title: 'Создание первого пользователя',
            description: 'Создание первого пользователя',
            keywords: 'Создание, Payload, CMS'
        }),
        React.createElement(
            Form,
            {
                onSuccess: onSuccess,
                method: 'post',
                redirect: admin,
                action: `${serverURL}${api}/${userSlug}/first-register`,
                validationOperation: 'create'
            },
            React.createElement(RenderFields, {
                fieldSchema: [...fields, ...userConfig.fields],
                fieldTypes: fieldTypes
            }),
            React.createElement(FormSubmit, null, 'Создать')
        )
    );
};
export default CreateFirstUser;
