import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useConfig } from '../../../../utilities/Config';
import Email from '../../../../forms/field-types/Email';
import Password from '../../../../forms/field-types/Password';
import Checkbox from '../../../../forms/field-types/Checkbox';
import Button from '../../../../elements/Button';
import ConfirmPassword from '../../../../forms/field-types/ConfirmPassword';
import { useWatchForm, useFormModified } from '../../../../forms/Form/context';
import { Props } from './types';

import APIKey from './APIKey';

import './index.scss';

const baseClass = 'auth-fields';

const Auth: React.FC<Props> = (props) => {
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
        async (state: boolean) => {
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

    return (
        <div className={baseClass}>
            <Email
                required
                name="email"
                label="Email"
                admin={{ autoComplete: 'email' }}
            />
            {(changingPassword || requirePassword) && (
                <div className={`${baseClass}__changing-password`}>
                    <Password
                        autoComplete="off"
                        required
                        name="password"
                        label="Новый пароль"
                    />
                    <ConfirmPassword />
                    {!requirePassword && (
                        <Button
                            size="small"
                            buttonStyle="secondary"
                            onClick={() => handleChangePassword(false)}
                        >
                            Отмена
                        </Button>
                    )}
                </div>
            )}
            {!changingPassword && !requirePassword && (
                <Button
                    size="small"
                    buttonStyle="secondary"
                    onClick={() => handleChangePassword(true)}
                >
                    Изменить пароль
                </Button>
            )}
            {operation === 'update' && (
                <Button
                    size="small"
                    buttonStyle="secondary"
                    onClick={() => unlock()}
                >
                    Принудительная разблокировка
                </Button>
            )}
            {useAPIKey && (
                <div className={`${baseClass}__api-key`}>
                    <Checkbox label="Enable API Key" name="enableAPIKey" />
                    {enableAPIKey?.value && <APIKey />}
                </div>
            )}
            {verify && <Checkbox label="Verified" name="_verified" />}
        </div>
    );
};

export default Auth;
