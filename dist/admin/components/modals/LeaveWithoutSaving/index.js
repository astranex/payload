import React from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';
import { useAuth } from '../../utilities/Auth';
import { useFormModified } from '../../forms/Form/context';
import MinimalTemplate from '../../templates/Minimal';
import Button from '../../elements/Button';
import './index.scss';
const modalSlug = 'leave-without-saving';
const LeaveWithoutSaving = () => {
    const modified = useFormModified();
    const { user } = useAuth();
    return React.createElement(
        NavigationPrompt,
        { when: Boolean(modified && user) },
        ({ onConfirm, onCancel }) =>
            React.createElement(
                'div',
                { className: modalSlug },
                React.createElement(
                    MinimalTemplate,
                    { className: `${modalSlug}__template` },
                    React.createElement('h1', null, 'Уйти не сохранив?'),
                    React.createElement(
                        'p',
                        null,
                        'Ваши изменения не были сохранены. Если вы уйдёте сейчас, вы потеряете свои изменения.'
                    ),
                    React.createElement(
                        Button,
                        { onClick: onCancel, buttonStyle: 'secondary' },
                        'Остаться на странице'
                    ),
                    React.createElement(
                        Button,
                        { onClick: onConfirm },
                        'Уйти в любом случае'
                    )
                )
            )
    );
};
export default LeaveWithoutSaving;
