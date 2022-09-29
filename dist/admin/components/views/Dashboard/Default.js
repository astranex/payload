import React from 'react';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../utilities/Config';
import Eyebrow from '../../elements/Eyebrow';
import Card from '../../elements/Card';
import Button from '../../elements/Button';
import { Gutter } from '../../elements/Gutter';
import './index.scss';
const baseClass = 'dashboard';
const Dashboard = (props) => {
    const { collections, globals, permissions, } = props;
    const { push } = useHistory();
    const { routes: { admin, }, admin: { components: { afterDashboard, beforeDashboard, }, }, } = useConfig();
    return (React.createElement("div", { className: baseClass },
        React.createElement(Eyebrow, null),
        React.createElement(Gutter, { className: `${baseClass}__wrap` },
            Array.isArray(beforeDashboard) &&
                beforeDashboard.map((Component, i) => React.createElement(Component, { key: i })),
            React.createElement("h2", { className: `${baseClass}__label` }, "\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438"),
            React.createElement("ul", { className: `${baseClass}__card-list` }, collections.map((collection) => {
                var _a, _b, _c;
                const hasCreatePermission = (_c = (_b = (_a = permissions === null || permissions === void 0 ? void 0 : permissions.collections) === null || _a === void 0 ? void 0 : _a[collection.slug]) === null || _b === void 0 ? void 0 : _b.create) === null || _c === void 0 ? void 0 : _c.permission;
                return (React.createElement("li", { key: collection.slug },
                    React.createElement(Card, { title: collection.labels.plural, id: `card-${collection.slug}`, onClick: () => push({
                            pathname: `${admin}/collections/${collection.slug}`
                        }), actions: hasCreatePermission ? (React.createElement(Button, { el: "link", to: `${admin}/collections/${collection.slug}/create`, icon: "plus", round: true, buttonStyle: "icon-label", iconStyle: "with-border" })) : undefined })));
            })),
            globals.length > 0 && (React.createElement(React.Fragment, null,
                React.createElement("h2", { className: `${baseClass}__label` }, "\u0413\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0435"),
                React.createElement("ul", { className: `${baseClass}__card-list` }, globals.map((global) => (React.createElement("li", { key: global.slug },
                    React.createElement(Card, { title: global.label, onClick: () => push({
                            pathname: `${admin}/globals/${global.slug}`
                        }) }))))))),
            Array.isArray(afterDashboard) &&
                afterDashboard.map((Component, i) => React.createElement(Component, { key: i })))));
};
export default Dashboard;
