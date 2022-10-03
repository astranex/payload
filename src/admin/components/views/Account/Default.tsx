import React from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { useConfig } from '../../utilities/Config';
import Eyebrow from '../../elements/Eyebrow';
import Form from '../../forms/Form';
import PreviewButton from '../../elements/PreviewButton';
import FormSubmit from '../../forms/Submit';
import RenderFields from '../../forms/RenderFields';
import CopyToClipboard from '../../elements/CopyToClipboard';
import fieldTypes from '../../forms/field-types';
import RenderTitle from '../../elements/RenderTitle';
import LeaveWithoutSaving from '../../modals/LeaveWithoutSaving';
import Meta from '../../utilities/Meta';
import Auth from '../collections/Edit/Auth';
import Loading from '../../elements/Loading';
import { Props } from './types';
import { OperationContext } from '../../utilities/OperationProvider';
import { ToggleTheme } from './ToggleTheme';
import { Gutter } from '../../elements/Gutter';

import './index.scss';

const baseClass = 'account';

const DefaultAccount: React.FC<Props> = (props) => {
    const {
        collection,
        data,
        permissions,
        hasSavePermission,
        apiURL,
        initialState,
        isLoading,
        action
    } = props;

    const {
        slug,
        fields,
        admin: { useAsTitle, preview },
        timestamps,
        auth
    } = collection;

    const {
        admin: { dateFormat },
        routes: { admin }
    } = useConfig();

    const classes = [baseClass].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            {isLoading && <Loading />}
            {!isLoading && (
                <OperationContext.Provider value="update">
                    <Form
                        className={`${baseClass}__form`}
                        method="patch"
                        action={action}
                        initialState={initialState}
                        disabled={!hasSavePermission}
                    >
                        <div className={`${baseClass}__main`}>
                            <Meta
                                title="Аккаунт"
                                description="Аккаунт текущего пользователя"
                                keywords="Аккаунт, Панель управления, Payload, CMS"
                            />
                            <Eyebrow />
                            {!(
                                collection.versions?.drafts &&
                                collection.versions?.drafts?.autosave
                            ) && <LeaveWithoutSaving />}
                            <div className={`${baseClass}__edit`}>
                                <Gutter className={`${baseClass}__header`}>
                                    <h1>
                                        <RenderTitle
                                            {...{
                                                data,
                                                useAsTitle,
                                                fallback: '[Без названия]'
                                            }}
                                        />
                                    </h1>
                                    <Auth
                                        useAPIKey={auth.useAPIKey}
                                        collection={collection}
                                        email={data?.email}
                                        operation="update"
                                    />
                                    <RenderFields
                                        permissions={permissions.fields}
                                        readOnly={!hasSavePermission}
                                        filter={(field) =>
                                            field?.admin?.position !== 'sidebar'
                                        }
                                        fieldTypes={fieldTypes}
                                        fieldSchema={fields}
                                    />
                                </Gutter>
                                <Gutter
                                    className={`${baseClass}__payload-settings`}
                                >
                                    <h3>Настройки панели управления</h3>
                                    <ToggleTheme />
                                </Gutter>
                            </div>
                        </div>
                        <div className={`${baseClass}__sidebar-wrap`}>
                            <div className={`${baseClass}__sidebar`}>
                                <div
                                    className={`${baseClass}__sidebar-sticky-wrap`}
                                >
                                    <ul
                                        className={`${baseClass}__collection-actions`}
                                    >
                                        {permissions?.create?.permission && (
                                            <React.Fragment>
                                                <li>
                                                    <Link
                                                        to={`${admin}/collections/${slug}/create`}
                                                    >
                                                        Создать
                                                    </Link>
                                                </li>
                                            </React.Fragment>
                                        )}
                                    </ul>
                                    <div
                                        className={`${baseClass}__document-actions${
                                            preview
                                                ? ` ${baseClass}__document-actions--with-preview`
                                                : ''
                                        }`}
                                    >
                                        <PreviewButton
                                            generatePreviewURL={preview}
                                            data={data}
                                        />
                                        {hasSavePermission && (
                                            <FormSubmit>Сохранить</FormSubmit>
                                        )}
                                    </div>
                                    <div
                                        className={`${baseClass}__sidebar-fields`}
                                    >
                                        <RenderFields
                                            permissions={permissions.fields}
                                            readOnly={!hasSavePermission}
                                            filter={(field) =>
                                                field?.admin?.position ===
                                                'sidebar'
                                            }
                                            fieldTypes={fieldTypes}
                                            fieldSchema={fields}
                                        />
                                    </div>
                                    <ul className={`${baseClass}__meta`}>
                                        <li className={`${baseClass}__api-url`}>
                                            <span
                                                className={`${baseClass}__label`}
                                            >
                                                API URL{' '}
                                                <CopyToClipboard
                                                    value={apiURL}
                                                />
                                            </span>
                                            <a
                                                href={apiURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {apiURL}
                                            </a>
                                        </li>
                                        <li>
                                            <div
                                                className={`${baseClass}__label`}
                                            >
                                                ID
                                            </div>
                                            <div>{data?.id}</div>
                                        </li>
                                        {timestamps && (
                                            <React.Fragment>
                                                {data.updatedAt && (
                                                    <li>
                                                        <div
                                                            className={`${baseClass}__label`}
                                                        >
                                                            Дата обновления
                                                        </div>
                                                        <div>
                                                            {format(
                                                                new Date(
                                                                    data.updatedAt
                                                                ),
                                                                dateFormat
                                                            )}
                                                        </div>
                                                    </li>
                                                )}
                                                {data.createdAt && (
                                                    <li>
                                                        <div
                                                            className={`${baseClass}__label`}
                                                        >
                                                            Дата создания
                                                        </div>
                                                        <div>
                                                            {format(
                                                                new Date(
                                                                    data.createdAt
                                                                ),
                                                                dateFormat
                                                            )}
                                                        </div>
                                                    </li>
                                                )}
                                            </React.Fragment>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Form>
                </OperationContext.Provider>
            )}
        </div>
    );
};

export default DefaultAccount;
