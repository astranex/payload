import React, { useCallback } from 'react';
import RadioGroupInput from '../../../forms/field-types/RadioGroup/Input';
import { useTheme } from '../../../utilities/Theme';
export const ToggleTheme = () => {
    const { theme, setTheme, autoMode } = useTheme();
    const onChange = useCallback(
        (newTheme) => {
            setTheme(newTheme);
        },
        [setTheme]
    );
    return React.createElement(RadioGroupInput, {
        name: 'theme',
        label: 'Тема',
        value: autoMode ? 'auto' : theme,
        onChange: onChange,
        options: [
            {
                label: 'Системная',
                value: 'auto'
            },
            {
                label: 'Светлая',
                value: 'light'
            },
            {
                label: 'Тёмная',
                value: 'dark'
            }
        ]
    });
};
