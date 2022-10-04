import React from 'react';
import { Props } from './types';

import './index.scss';

const baseClass = 'condition-value-text';

const Text: React.FC<Props> = ({ onChange, value }) => (
    <input
        placeholder="Введите значение"
        className={baseClass}
        type="text"
        onChange={(e) => onChange(e.target.value)}
        value={value || ''}
    />
);

export default Text;
