import React, { useState, useReducer } from 'react';
import queryString from 'qs';
import { useHistory } from 'react-router-dom';
import useThrottledEffect from '../../../hooks/useThrottledEffect';
import Button from '../Button';
import reducer from './reducer';
import Condition from './Condition';
import fieldTypes from './field-types';
import flattenTopLevelFields from '../../../../utilities/flattenTopLevelFields';
import { useSearchParams } from '../../utilities/SearchParams';
import validateWhereQuery from './validateWhereQuery';
import './index.scss';
const baseClass = 'where-builder';
const reduceFields = (fields) =>
    flattenTopLevelFields(fields).reduce((reduced, field) => {
        if (typeof fieldTypes[field.type] === 'object') {
            const formattedField = {
                label: field.label,
                value: field.name,
                ...fieldTypes[field.type],
                props: {
                    ...field
                }
            };
            return [...reduced, formattedField];
        }
        return reduced;
    }, []);
const WhereBuilder = (props) => {
    const {
        collection,
        modifySearchQuery = true,
        handleChange,
        collection: { labels: { plural } = {} } = {}
    } = props;
    const history = useHistory();
    const params = useSearchParams();
    const [conditions, dispatchConditions] = useReducer(
        reducer,
        params.where,
        (whereFromSearch) => {
            if (modifySearchQuery && validateWhereQuery(whereFromSearch)) {
                return whereFromSearch.or;
            }
            return [];
        }
    );
    const [reducedFields] = useState(() => reduceFields(collection.fields));
    useThrottledEffect(
        () => {
            const currentParams = queryString.parse(history.location.search, {
                ignoreQueryPrefix: true,
                depth: 10
            });
            const newWhereQuery = {
                ...(typeof (currentParams === null || currentParams === void 0
                    ? void 0
                    : currentParams.where) === 'object'
                    ? currentParams.where
                    : {}),
                or: conditions
            };
            if (handleChange) handleChange(newWhereQuery);
            const hasExistingConditions =
                typeof (currentParams === null || currentParams === void 0
                    ? void 0
                    : currentParams.where) === 'object' &&
                'or' in currentParams.where;
            const hasNewWhereConditions = conditions.length > 0;
            if (
                modifySearchQuery &&
                ((hasExistingConditions && !hasNewWhereConditions) ||
                    hasNewWhereConditions)
            ) {
                history.replace({
                    search: queryString.stringify(
                        {
                            ...currentParams,
                            page: 1,
                            where: newWhereQuery
                        },
                        { addQueryPrefix: true }
                    )
                });
            }
        },
        500,
        [conditions, modifySearchQuery, handleChange]
    );
    return React.createElement(
        'div',
        { className: baseClass },
        conditions.length > 0 &&
            React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    'div',
                    { className: `${baseClass}__label` },
                    'Фильтровать',
                    ' ',
                    plural,
                    ' ',
                    'когда'
                ),
                React.createElement(
                    'ul',
                    { className: `${baseClass}__or-filters` },
                    conditions.map((or, orIndex) =>
                        React.createElement(
                            'li',
                            { key: orIndex },
                            orIndex !== 0 &&
                                React.createElement(
                                    'div',
                                    { className: `${baseClass}__label` },
                                    'Или'
                                ),
                            React.createElement(
                                'ul',
                                { className: `${baseClass}__and-filters` },
                                Array.isArray(
                                    or === null || or === void 0
                                        ? void 0
                                        : or.and
                                ) &&
                                    or.and.map((_, andIndex) =>
                                        React.createElement(
                                            'li',
                                            { key: andIndex },
                                            andIndex !== 0 &&
                                                React.createElement(
                                                    'div',
                                                    {
                                                        className: `${baseClass}__label`
                                                    },
                                                    'И'
                                                ),
                                            React.createElement(Condition, {
                                                value: conditions[orIndex].and[
                                                    andIndex
                                                ],
                                                orIndex: orIndex,
                                                andIndex: andIndex,
                                                key: andIndex,
                                                fields: reducedFields,
                                                dispatch: dispatchConditions
                                            })
                                        )
                                    )
                            )
                        )
                    )
                ),
                React.createElement(
                    Button,
                    {
                        className: `${baseClass}__add-or`,
                        icon: 'plus',
                        buttonStyle: 'icon-label',
                        iconPosition: 'left',
                        iconStyle: 'with-border',
                        onClick: () =>
                            dispatchConditions({
                                type: 'add',
                                field: reducedFields[0].value
                            })
                    },
                    'Или'
                )
            ),
        conditions.length === 0 &&
            React.createElement(
                'div',
                { className: `${baseClass}__no-filters` },
                React.createElement(
                    'div',
                    { className: `${baseClass}__label` },
                    'Фильтры не установлены'
                ),
                React.createElement(
                    Button,
                    {
                        className: `${baseClass}__add-first-filter`,
                        icon: 'plus',
                        buttonStyle: 'icon-label',
                        iconPosition: 'left',
                        iconStyle: 'with-border',
                        onClick: () =>
                            dispatchConditions({
                                type: 'add',
                                field: reducedFields[0].value
                            })
                    },
                    'Добавить фильтр'
                )
            )
    );
};
export default WhereBuilder;
