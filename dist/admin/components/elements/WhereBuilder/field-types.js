const boolean = [
    {
        label: 'равен',
        value: 'equals',
    },
    {
        label: 'не равен',
        value: 'not_equals',
    },
];
const base = [
    ...boolean,
    {
        label: 'находится в',
        value: 'in',
    },
    {
        label: 'не находится в',
        value: 'not_in',
    },
    {
        label: 'существует',
        value: 'exists',
    },
];
const numeric = [
    ...base,
    {
        label: 'больше, чем',
        value: 'greater_than',
    },
    {
        label: 'меньше, чем',
        value: 'less_than',
    },
    {
        label: 'меньше или равен',
        value: 'less_than_equal',
    },
    {
        label: 'больше или равен',
        value: 'greater_than_equals',
    },
];
const geo = [
    ...boolean,
    {
        label: 'существует',
        value: 'exists'
    },
    {
        label: 'рядом с',
        value: 'near'
    }
];
const like = {
    label: 'как',
    value: 'like',
};
const contains = {
    label: 'содержит',
    value: 'contains'
};
const fieldTypeConditions = {
    text: {
        component: 'Text',
        operators: [...base, like, contains],
    },
    email: {
        component: 'Text',
        operators: [...base, contains],
    },
    textarea: {
        component: 'Text',
        operators: [...base, like, contains],
    },
    code: {
        component: 'Text',
        operators: [...base, like, contains],
    },
    richText: {
        component: 'Text',
        operators: [...base, like, contains],
    },
    number: {
        component: 'Number',
        operators: [...base, ...numeric],
    },
    date: {
        component: 'Date',
        operators: [...base, ...numeric],
    },
    point: {
        component: 'Point',
        operators: [...geo],
    },
    upload: {
        component: 'Text',
        operators: [...base],
    },
    relationship: {
        component: 'Relationship',
        operators: [...base],
    },
    select: {
        component: 'Text',
        operators: [...base],
    },
    checkbox: {
        component: 'Text',
        operators: boolean,
    },
};
export default fieldTypeConditions;
