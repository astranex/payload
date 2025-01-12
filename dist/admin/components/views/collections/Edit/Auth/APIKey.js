import React, { useMemo, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useField from '../../../../forms/useField';
import Label from '../../../../forms/Label';
import CopyToClipboard from '../../../../elements/CopyToClipboard';
import { text } from '../../../../../../fields/validations';
import { useWatchForm } from '../../../../forms/Form/context';
import GenerateConfirmation from '../../../../elements/GenerateConfirmation';
const path = 'apiKey';
const baseClass = 'api-key';
const validate = (val) => text(val, { minLength: 24, maxLength: 48, data: {}, siblingData: {} });
const APIKey = () => {
    const [initialAPIKey, setInitialAPIKey] = useState(null);
    const [highlightedField, setHighlightedField] = useState(false);
    const { getField } = useWatchForm();
    const apiKey = getField(path);
    const apiKeyValue = apiKey === null || apiKey === void 0 ? void 0 : apiKey.value;
    const APIKeyLabel = useMemo(() => (React.createElement("div", { className: `${baseClass}__label` },
        React.createElement("span", null, "API Key"),
        React.createElement(CopyToClipboard, { value: apiKeyValue }))), [apiKeyValue]);
    const fieldType = useField({
        path: 'apiKey',
        validate,
    });
    const highlightField = () => {
        if (highlightedField) {
            setHighlightedField(false);
        }
        setTimeout(() => {
            setHighlightedField(true);
        }, 1);
    };
    const { value, setValue, } = fieldType;
    useEffect(() => {
        setInitialAPIKey(uuidv4());
    }, []);
    useEffect(() => {
        if (!apiKeyValue) {
            setValue(initialAPIKey);
        }
    }, [apiKeyValue, setValue, initialAPIKey]);
    useEffect(() => {
        if (highlightedField) {
            setTimeout(() => {
                setHighlightedField(false);
            }, 10000);
        }
    }, [highlightedField]);
    const classes = [
        'field-type',
        'api-key',
        'read-only',
    ].filter(Boolean).join(' ');
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: classes },
            React.createElement(Label, { htmlFor: path, label: APIKeyLabel }),
            React.createElement("input", { value: value || '', className: highlightedField ? 'highlight' : undefined, disabled: true, type: "text", id: "apiKey", name: "apiKey" })),
        React.createElement(GenerateConfirmation, { setKey: () => setValue(uuidv4()), highlightField: highlightField })));
};
export default APIKey;
