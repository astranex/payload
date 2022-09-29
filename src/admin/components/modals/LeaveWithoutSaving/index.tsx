import React from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';
import { useAuth } from '../../utilities/Auth';
import { useFormModified } from '../../forms/Form/context';
import MinimalTemplate from '../../templates/Minimal';
import Button from '../../elements/Button';

import './index.scss';

const modalSlug = 'leave-without-saving';

const LeaveWithoutSaving: React.FC = () => {
    const modified = useFormModified();
    const { user } = useAuth();

    return (
        <NavigationPrompt when={Boolean(modified && user)}>
            {({ onConfirm, onCancel }) => (
                <div className={modalSlug}>
                    <MinimalTemplate className={`${modalSlug}__template`}>
                        <h1>Уйти не сохранив?</h1>
                        <p>
                            Ваши изменения не были сохранены. Если вы уйдёте
                            сейчас, вы потеряете свои изменения.
                        </p>
                        <Button onClick={onCancel} buttonStyle="secondary">
                            Остаться на странице
                        </Button>
                        <Button onClick={onConfirm}>Уйти в любом случае</Button>
                    </MinimalTemplate>
                </div>
            )}
        </NavigationPrompt>
    );
};

export default LeaveWithoutSaving;
