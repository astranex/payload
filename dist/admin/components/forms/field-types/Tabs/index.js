import React, { useState } from 'react';
import RenderFields from '../../RenderFields';
import withCondition from '../../withCondition';
import FieldDescription from '../../FieldDescription';
import toKebabCase from '../../../../../utilities/toKebabCase';
import { useCollapsible } from '../../../elements/Collapsible/provider';
import { TabsProvider } from './provider';
import { getFieldPath } from '../getFieldPath';
import './index.scss';
const baseClass = 'tabs-field';
const TabsField = (props) => {
    const { tabs, fieldTypes, path, permissions, admin: { readOnly, className, }, } = props;
    const isWithinCollapsible = useCollapsible();
    const [active, setActive] = useState(0);
    const activeTab = tabs[active];
    return (React.createElement("div", { className: [
            className,
            baseClass,
            isWithinCollapsible && `${baseClass}--within-collapsible`,
        ].filter(Boolean).join(' ') },
        React.createElement(TabsProvider, null,
            React.createElement("div", { className: `${baseClass}__tabs-wrap` },
                React.createElement("div", { className: `${baseClass}__tabs` }, tabs.map((tab, i) => {
                    return (React.createElement("button", { key: i, type: "button", className: [
                            `${baseClass}__tab-button`,
                            active === i && `${baseClass}__tab-button--active`,
                        ].filter(Boolean).join(' '), onClick: () => setActive(i) }, tab.label));
                }))),
            React.createElement("div", { className: `${baseClass}__content-wrap` }, activeTab && (React.createElement("div", { className: [
                    `${baseClass}__tab`,
                    `${baseClass}__tab-${toKebabCase(activeTab.label)}`,
                ].join(' ') },
                React.createElement(FieldDescription, { className: `${baseClass}__description`, description: activeTab.description }),
                React.createElement(RenderFields, { key: activeTab.label, forceRender: true, readOnly: readOnly, permissions: permissions === null || permissions === void 0 ? void 0 : permissions.fields, fieldTypes: fieldTypes, fieldSchema: activeTab.fields.map((field) => ({
                        ...field,
                        path: getFieldPath(path, field),
                    })) })))))));
};
export default withCondition(TabsField);
