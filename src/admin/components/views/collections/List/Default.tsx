import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../../utilities/Config';
import UploadGallery from '../../../elements/UploadGallery';
import Eyebrow from '../../../elements/Eyebrow';
import Paginator from '../../../elements/Paginator';
import ListControls from '../../../elements/ListControls';
import Pill from '../../../elements/Pill';
import Button from '../../../elements/Button';
import Table from '../../../elements/Table';
import Meta from '../../../utilities/Meta';
import { Props } from './types';
import ViewDescription from '../../../elements/ViewDescription';
import PerPage from '../../../elements/PerPage';
import { Gutter } from '../../../elements/Gutter';
import { RelationshipProvider } from './RelationshipProvider';

import './index.scss';

const baseClass = 'collection-list';

const DefaultList: React.FC<Props> = (props) => {
    const {
        collection,
        collection: {
            upload,
            slug,
            labels: { singular: singularLabel, plural: pluralLabel },
            admin: { description } = {}
        },
        data,
        newDocumentURL,
        limit,
        tableColumns,
        columnNames,
        setColumns,
        hasCreatePermission
    } = props;

    const {
        routes: { admin }
    } = useConfig();
    const history = useHistory();

    return (
        <div className={baseClass}>
            <Meta title={collection.labels.plural} />
            <Eyebrow />
            <Gutter className={`${baseClass}__wrap`}>
                <header className={`${baseClass}__header`}>
                    <h1>{pluralLabel}</h1>
                    {hasCreatePermission && (
                        <Pill to={newDocumentURL}>Создать</Pill>
                    )}
                    {description && (
                        <div className={`${baseClass}__sub-header`}>
                            <ViewDescription description={description} />
                        </div>
                    )}
                </header>
                <ListControls
                    collection={collection}
                    columns={columnNames}
                    setColumns={setColumns}
                    enableColumns={Boolean(!upload)}
                    enableSort={Boolean(upload)}
                />
                {data.docs && data.docs.length > 0 && (
                    <React.Fragment>
                        {!upload && (
                            <RelationshipProvider>
                                <Table
                                    data={data.docs}
                                    columns={tableColumns}
                                />
                            </RelationshipProvider>
                        )}
                        {upload && (
                            <UploadGallery
                                docs={data.docs}
                                collection={collection}
                                onCardClick={(doc) =>
                                    history.push(
                                        `${admin}/collections/${slug}/${doc.id}`
                                    )
                                }
                            />
                        )}
                    </React.Fragment>
                )}
                {data.docs && data.docs.length === 0 && (
                    <div className={`${baseClass}__no-results`}>
                        <p>
                            No {pluralLabel} found. Either no {pluralLabel}{' '}
                            exist yet or none match the filters you&apos;ve
                            specified above.
                        </p>
                        {hasCreatePermission && (
                            <Button el="link" to={newDocumentURL}>
                                Создать {singularLabel}
                            </Button>
                        )}
                    </div>
                )}
                <div className={`${baseClass}__page-controls`}>
                    <Paginator
                        limit={data.limit}
                        totalPages={data.totalPages}
                        page={data.page}
                        hasPrevPage={data.hasPrevPage}
                        hasNextPage={data.hasNextPage}
                        prevPage={data.prevPage}
                        nextPage={data.nextPage}
                        numberOfNeighbors={1}
                    />
                    {data?.totalDocs > 0 && (
                        <Fragment>
                            <div className={`${baseClass}__page-info`}>
                                {data.page * data.limit - (data.limit - 1)}-
                                {data.totalPages > 1 &&
                                data.totalPages !== data.page
                                    ? data.limit * data.page
                                    : data.totalDocs}{' '}
                                of {data.totalDocs}
                            </div>
                            <PerPage
                                limits={collection?.admin?.pagination?.limits}
                                limit={limit}
                            />
                        </Fragment>
                    )}
                </div>
            </Gutter>
        </div>
    );
};

export default DefaultList;
