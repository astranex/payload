import React from 'react';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import MinimalTemplate from '../../templates/Minimal';
import Meta from '../../utilities/Meta';
import Form from '../../forms/Form';
import RenderFields from '../../forms/RenderFields';
import fieldTypes from '../../forms/field-types';
import FormSubmit from '../../forms/Submit';
import { Props } from './types';
import { Field } from '../../../../fields/config/types';

import './index.scss';

const baseClass = 'create-first-user';

const CreateFirstUser: React.FC<Props> = (props) => {
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
        if (json?.user?.token) {
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
    ] as Field[];

    return (
        <MinimalTemplate className={baseClass}>
            <h1>Welcome</h1>
            <p>To begin, create your first user.</p>
            <Meta
                title="Создание первого пользователя"
                description="Создания первого пользователя"
                keywords="Создание, Payload, CMS"
            />
            <Form
                onSuccess={onSuccess}
                method="post"
                redirect={admin}
                action={`${serverURL}${api}/${userSlug}/first-register`}
                validationOperation="create"
            >
                <RenderFields
                    fieldSchema={[...fields, ...userConfig.fields]}
                    fieldTypes={fieldTypes}
                />
                <FormSubmit>Создать</FormSubmit>
            </Form>
        </MinimalTemplate>
    );
};

export default CreateFirstUser;
