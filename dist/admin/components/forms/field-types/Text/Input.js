import React from 'react';
import Label from '../../Label';
import Error from '../../Error';
import FieldDescription from '../../FieldDescription';
// import { FieldType } from '../../useField/types';
import './index.scss';
const TextInput = (props) => {
    const { showError, errorMessage, placeholder, readOnly, path, label, required, value, onChange, description, style, className, width, } = props;
    const classes = [
        'field-type',
        'text',
        className,
        showError && 'error',
        readOnly && 'read-only',
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes, style: {
            ...style,
            width,
        } },
        React.createElement(Error, { showError: showError, message: errorMessage }),
        React.createElement(Label, { htmlFor: `field-${path.replace(/\./gi, '__')}`, label: label, required: required }),
        React.createElement("input", { id: `field-${path.replace(/\./gi, '__')}`, value: value || '', onChange: onChange, disabled: readOnly, placeholder: placeholder, type: "text", name: path }),
        React.createElement(FieldDescription, { value: value, description: description })));
};
export default TextInput;
