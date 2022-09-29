import React, { useState, useEffect } from 'react';
import queryString from 'qs';
import { useHistory } from 'react-router-dom';
import { Props } from './types';
import ReactSelect from '../ReactSelect';
import sortableFieldTypes from '../../../../fields/sortableFieldTypes';
import { useSearchParams } from '../../utilities/SearchParams';
import { fieldAffectsData } from '../../../../fields/config/types';

import './index.scss';

const baseClass = 'sort-complex';

const sortOptions = [
    { label: 'Восходящий', value: '' },
    { label: 'Нисходящий', value: '-' }
];

const SortComplex: React.FC<Props> = (props) => {
    const { collection, modifySearchQuery = true, handleChange } = props;

    const history = useHistory();
    const params = useSearchParams();

    const [sortFields] = useState(() =>
        collection.fields.reduce((fields, field) => {
            if (
                fieldAffectsData(field) &&
                sortableFieldTypes.indexOf(field.type) > -1
            ) {
                return [...fields, { label: field.label, value: field.name }];
            }
            return fields;
        }, [])
    );

    const [sortField, setSortField] = useState(sortFields[0]);
    const [sortOrder, setSortOrder] = useState({
        label: 'Нисходящий',
        value: '-'
    });

    useEffect(() => {
        if (sortField?.value) {
            const newSortValue = `${sortOrder.value}${sortField.value}`;

            if (handleChange) handleChange(newSortValue);

            if (params.sort !== newSortValue && modifySearchQuery) {
                history.replace({
                    search: queryString.stringify(
                        {
                            ...params,
                            sort: newSortValue
                        },
                        { addQueryPrefix: true }
                    )
                });
            }
        }
    }, [
        history,
        params,
        sortField,
        sortOrder,
        modifySearchQuery,
        handleChange
    ]);

    return (
        <div className={baseClass}>
            <React.Fragment>
                <div className={`${baseClass}__wrap`}>
                    <div className={`${baseClass}__select`}>
                        <div className={`${baseClass}__label`}>
                            Колонка для сортировки
                        </div>
                        <ReactSelect
                            value={sortField}
                            options={sortFields}
                            onChange={setSortField}
                        />
                    </div>
                    <div className={`${baseClass}__select`}>
                        <div className={`${baseClass}__label`}>Порядок</div>
                        <ReactSelect
                            value={sortOrder}
                            options={sortOptions}
                            onChange={setSortOrder}
                        />
                    </div>
                </div>
            </React.Fragment>
        </div>
    );
};

export default SortComplex;
