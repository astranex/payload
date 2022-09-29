import React, { useCallback, useEffect, useState } from 'react';
import RenderFields from '../../RenderFields';
import withCondition from '../../withCondition';
import { Collapsible } from '../../../elements/Collapsible';
import toKebabCase from '../../../../../utilities/toKebabCase';
import { usePreferences } from '../../../utilities/Preferences';
import { useDocumentInfo } from '../../../utilities/DocumentInfo';
import FieldDescription from '../../FieldDescription';
import { getFieldPath } from '../getFieldPath';
import './index.scss';
const baseClass = 'collapsible-field';
const CollapsibleField = (props) => {
    const { label, fields, fieldTypes, path, permissions, admin: { readOnly, className, description, }, } = props;
    const { getPreference, setPreference } = usePreferences();
    const { preferencesKey } = useDocumentInfo();
    const [initCollapsed, setInitCollapsed] = useState();
    const [fieldPreferencesKey] = useState(() => `collapsible-${toKebabCase(label)}`);
    const onToggle = useCallback(async (newCollapsedState) => {
        var _a;
        const existingPreferences = await getPreference(preferencesKey);
        setPreference(preferencesKey, {
            ...existingPreferences,
            fields: {
                ...(existingPreferences === null || existingPreferences === void 0 ? void 0 : existingPreferences.fields) || {},
                [fieldPreferencesKey]: {
                    ...(_a = existingPreferences === null || existingPreferences === void 0 ? void 0 : existingPreferences.fields) === null || _a === void 0 ? void 0 : _a[fieldPreferencesKey],
                    collapsed: newCollapsedState,
                },
            },
        });
    }, [preferencesKey, fieldPreferencesKey, getPreference, setPreference]);
    useEffect(() => {
        const fetchInitialState = async () => {
            var _a, _b;
            const preferences = await getPreference(preferencesKey);
            setInitCollapsed(Boolean((_b = (_a = preferences === null || preferences === void 0 ? void 0 : preferences.fields) === null || _a === void 0 ? void 0 : _a[fieldPreferencesKey]) === null || _b === void 0 ? void 0 : _b.collapsed));
        };
        fetchInitialState();
    }, [getPreference, preferencesKey, fieldPreferencesKey]);
    if (typeof initCollapsed !== 'boolean')
        return null;
    return (React.createElement(React.Fragment, null,
        React.createElement(Collapsible, { initCollapsed: initCollapsed, className: [
                'field-type',
                baseClass,
                className,
            ].filter(Boolean).join(' '), header: React.createElement("div", { className: `${baseClass}__label` }, label), onToggle: onToggle },
            React.createElement(RenderFields, { forceRender: true, readOnly: readOnly, permissions: permissions === null || permissions === void 0 ? void 0 : permissions.fields, fieldTypes: fieldTypes, fieldSchema: fields.map((field) => ({
                    ...field,
                    path: getFieldPath(path, field),
                })) })),
        React.createElement(FieldDescription, { description: description })));
};
export default withCondition(CollapsibleField);
