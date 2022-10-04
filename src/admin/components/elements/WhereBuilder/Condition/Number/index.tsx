import React from 'react';
import { Props } from './types';

import './index.scss';

const baseClass = 'condition-value-number';

const NumberField: React.FC<Props> = ({ onChange, value }) => (
    <input
        placeholder="Введите значение"
        className={baseClass}
        type="number"
        onChange={(e) => onChange(e.target.value)}
        value={value}
    />
);

export default NumberField;
