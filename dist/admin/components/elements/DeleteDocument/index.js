import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { Modal, useModal } from '@faceless-ui/modal';
import { useConfig } from '../../utilities/Config';
import Button from '../Button';
import MinimalTemplate from '../../templates/Minimal';
import { useForm } from '../../forms/Form/context';
import useTitle from '../../../hooks/useTitle';
import { requests } from '../../../api';
import './index.scss';
const baseClass = 'delete-document';
const DeleteDocument = (props) => {
    const {
        title: titleFromProps,
        id,
        buttonId,
        collection: {
            admin: { useAsTitle },
            slug,
            labels: { singular } = {}
        } = {}
    } = props;
    const {
        serverURL,
        routes: { api, admin }
    } = useConfig();
    const { setModified } = useForm();
    const [deleting, setDeleting] = useState(false);
    const { closeAll, toggle } = useModal();
    const history = useHistory();
    const title = useTitle(useAsTitle) || id;
    const titleToRender = titleFromProps || title;
    const modalSlug = `delete-${id}`;
    const addDefaultError = useCallback(() => {
        toast.error(
            `Произошла ошибка при удалении ${title}. Пожалуйста, проверьте ваше соединение и повторите попытку.`
        );
    }, [title]);
    const handleDelete = useCallback(() => {
        setDeleting(true);
        setModified(false);
        requests
            .delete(`${serverURL}${api}/${slug}/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                try {
                    const json = await res.json();
                    if (res.status < 400) {
                        closeAll();
                        toast.success(`${singular} "${title}" успешно удалён.`);
                        return history.push(`${admin}/collections/${slug}`);
                    }
                    closeAll();
                    if (json.errors) {
                        json.errors.forEach((error) =>
                            toast.error(error.message)
                        );
                    } else {
                        addDefaultError();
                    }
                    return false;
                } catch (e) {
                    return addDefaultError();
                }
            });
    }, [
        addDefaultError,
        closeAll,
        history,
        id,
        singular,
        slug,
        title,
        admin,
        api,
        serverURL,
        setModified
    ]);
    if (id) {
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                'button',
                {
                    type: 'button',
                    id: buttonId,
                    className: `${baseClass}__toggle`,
                    onClick: (e) => {
                        e.preventDefault();
                        setDeleting(false);
                        toggle(modalSlug);
                    }
                },
                'Удалить'
            ),
            React.createElement(
                Modal,
                { slug: modalSlug, className: baseClass },
                React.createElement(
                    MinimalTemplate,
                    { className: `${baseClass}__template` },
                    React.createElement('h1', null, 'Подтвердите удаление'),
                    React.createElement(
                        'p',
                        null,
                        'Вы собираетесь удалить',
                        ' ',
                        singular,
                        ' ',
                        '"',
                        React.createElement('strong', null, titleToRender),
                        '". Вы уверены?'
                    ),
                    React.createElement(
                        Button,
                        {
                            id: 'confirm-cancel',
                            buttonStyle: 'secondary',
                            type: 'button',
                            onClick: deleting
                                ? undefined
                                : () => toggle(modalSlug)
                        },
                        'Отмена'
                    ),
                    React.createElement(
                        Button,
                        {
                            onClick: deleting ? undefined : handleDelete,
                            id: 'confirm-delete'
                        },
                        deleting ? 'Удаление...' : 'Подтверждение'
                    )
                )
            )
        );
    }
    return null;
};
export default DeleteDocument;
