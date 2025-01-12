import React, { useState, useReducer } from 'react';
import queryString from 'qs';
import { useHistory } from 'react-router-dom';
import { Props } from './types';
import useThrottledEffect from '../../../hooks/useThrottledEffect';
import Button from '../Button';
import reducer from './reducer';
import Condition from './Condition';
import fieldTypes from './field-types';
import flattenTopLevelFields from '../../../../utilities/flattenTopLevelFields';
import { useSearchParams } from '../../utilities/SearchParams';
import validateWhereQuery from './validateWhereQuery';
import { Where } from '../../../../types';

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

const WhereBuilder: React.FC<Props> = (props) => {
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
                ...(typeof currentParams?.where === 'object'
                    ? currentParams.where
                    : {}),
                or: conditions
            };

            if (handleChange) handleChange(newWhereQuery as Where);

            const hasExistingConditions =
                typeof currentParams?.where === 'object' &&
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

    return (
        <div className={baseClass}>
            {conditions.length > 0 && (
                <React.Fragment>
                    <div className={`${baseClass}__label`}>
                        Фильтровать {plural} когда
                    </div>
                    <ul className={`${baseClass}__or-filters`}>
                        {conditions.map((or, orIndex) => (
                            <li key={orIndex}>
                                {orIndex !== 0 && (
                                    <div className={`${baseClass}__label`}>
                                        Или
                                    </div>
                                )}
                                <ul className={`${baseClass}__and-filters`}>
                                    {Array.isArray(or?.and) &&
                                        or.and.map((_, andIndex) => (
                                            <li key={andIndex}>
                                                {andIndex !== 0 && (
                                                    <div
                                                        className={`${baseClass}__label`}
                                                    >
                                                        И
                                                    </div>
                                                )}
                                                <Condition
                                                    value={
                                                        conditions[orIndex].and[
                                                            andIndex
                                                        ]
                                                    }
                                                    orIndex={orIndex}
                                                    andIndex={andIndex}
                                                    key={andIndex}
                                                    fields={reducedFields}
                                                    dispatch={
                                                        dispatchConditions
                                                    }
                                                />
                                            </li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <Button
                        className={`${baseClass}__add-or`}
                        icon="plus"
                        buttonStyle="icon-label"
                        iconPosition="left"
                        iconStyle="with-border"
                        onClick={() =>
                            dispatchConditions({
                                type: 'add',
                                field: reducedFields[0].value
                            })
                        }
                    >
                        Or
                    </Button>
                </React.Fragment>
            )}
            {conditions.length === 0 && (
                <div className={`${baseClass}__no-filters`}>
                    <div className={`${baseClass}__label`}>
                        Фильтры не установлены
                    </div>
                    <Button
                        className={`${baseClass}__add-first-filter`}
                        icon="plus"
                        buttonStyle="icon-label"
                        iconPosition="left"
                        iconStyle="with-border"
                        onClick={() =>
                            dispatchConditions({
                                type: 'add',
                                field: reducedFields[0].value
                            })
                        }
                    >
                        Добавить фильтр
                    </Button>
                </div>
            )}
        </div>
    );
};

export default WhereBuilder;
