import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useConfig } from '../../../../utilities/Config';
import Email from '../../../../forms/field-types/Email';
import Password from '../../../../forms/field-types/Password';
import Checkbox from '../../../../forms/field-types/Checkbox';
import Button from '../../../../elements/Button';
import ConfirmPassword from '../../../../forms/field-types/ConfirmPassword';
import { useWatchForm, useFormModified } from '../../../../forms/Form/context';
import APIKey from './APIKey';
import './index.scss';
const baseClass = 'auth-fields';
const Auth = (props) => {
    const {
        useAPIKey,
        requirePassword,
        verify,
        collection: { slug },
        collection,
        email,
        operation
    } = props;
    const [changingPassword, setChangingPassword] = useState(requirePassword);
    const { getField, dispatchFields } = useWatchForm();
    const modified = useFormModified();
    const enableAPIKey = getField('enableAPIKey');
    const {
        serverURL,
        routes: { api }
    } = useConfig();
    const handleChangePassword = useCallback(
        async (state) => {
            if (!state) {
                dispatchFields({ type: 'REMOVE', path: 'password' });
                dispatchFields({ type: 'REMOVE', path: 'confirm-password' });
            }
            setChangingPassword(state);
        },
        [dispatchFields]
    );
    const unlock = useCallback(async () => {
        const url = `${serverURL}${api}/${slug}/unlock`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            }),
            method: 'post'
        });
        if (response.status === 200) {
            toast.success('Успешно разблокирован', { autoClose: 3000 });
        } else {
            toast.error('Успешно разблокирован');
        }
    }, [serverURL, api, slug, email]);
    useEffect(() => {
        if (!modified) {
            setChangingPassword(false);
        }
    }, [modified]);
    if (collection.auth.disableLocalStrategy) {
        return null;
    }
    return React.createElement(
        'div',
        { className: baseClass },
        React.createElement(Email, {
            required: true,
            name: 'email',
            label: 'Email',
            admin: { autoComplete: 'email' }
        }),
        (changingPassword || requirePassword) &&
            React.createElement(
                'div',
                { className: `${baseClass}__changing-password` },
                React.createElement(Password, {
                    autoComplete: 'off',
                    required: true,
                    name: 'password',
                    label: 'Новый пароль'
                }),
                React.createElement(ConfirmPassword, null),
                !requirePassword &&
                    React.createElement(
                        Button,
                        {
                            size: 'small',
                            buttonStyle: 'secondary',
                            onClick: () => handleChangePassword(false)
                        },
                        'Отмена'
                    )
            ),
        !changingPassword &&
            !requirePassword &&
            React.createElement(
                Button,
                {
                    size: 'small',
                    buttonStyle: 'secondary',
                    onClick: () => handleChangePassword(true)
                },
                'Изменить пароль'
            ),
        operation === 'update' &&
            React.createElement(
                Button,
                {
                    size: 'small',
                    buttonStyle: 'secondary',
                    onClick: () => unlock()
                },
                'Принудительная разблокировка'
            ),
        useAPIKey &&
            React.createElement(
                'div',
                { className: `${baseClass}__api-key` },
                React.createElement(Checkbox, {
                    label: 'Enable API Key',
                    name: 'enableAPIKey'
                }),
                (enableAPIKey === null || enableAPIKey === void 0
                    ? void 0
                    : enableAPIKey.value) && React.createElement(APIKey, null)
            ),
        verify &&
            React.createElement(Checkbox, {
                label: 'Verified',
                name: '_verified'
            })
    );
};
export default Auth;
