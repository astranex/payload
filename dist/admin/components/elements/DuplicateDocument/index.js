import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, useModal } from '@faceless-ui/modal';
import { useConfig } from '../../utilities/Config';
import Button from '../Button';
import { requests } from '../../../api';
import { useForm, useFormModified } from '../../forms/Form/context';
import MinimalTemplate from '../../templates/Minimal';
import './index.scss';
const baseClass = 'duplicate';
const Duplicate = ({ slug, collection, id }) => {
    const { push } = useHistory();
    const modified = useFormModified();
    const { toggle } = useModal();
    const { setModified } = useForm();
    const { serverURL, routes: { api }, localization } = useConfig();
    const { routes: { admin } } = useConfig();
    const [hasClicked, setHasClicked] = useState(false);
    const modalSlug = `duplicate-${id}`;
    const handleClick = useCallback(async (override = false) => {
        setHasClicked(true);
        if (modified && !override) {
            toggle(modalSlug);
            return;
        }
        const create = async (locale) => {
            const localeParam = locale ? `locale=${locale}` : '';
            const response = await requests.get(`${serverURL}${api}/${slug}/${id}?${localeParam}`);
            const data = await response.json();
            const result = await requests.post(`${serverURL}${api}/${slug}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const json = await result.json();
            if (result.status === 201) {
                return json.doc.id;
            }
            json.errors.forEach((error) => toast.error(error.message));
            return null;
        };
        let duplicateID;
        if (localization) {
            duplicateID = await create(localization.defaultLocale);
            let abort = false;
            localization.locales
                .filter((locale) => locale !== localization.defaultLocale)
                .forEach(async (locale) => {
                if (!abort) {
                    const res = await requests.get(`${serverURL}${api}/${slug}/${id}?locale=${locale}`);
                    const localizedDoc = await res.json();
                    const patchResult = await requests.patch(`${serverURL}${api}/${slug}/${duplicateID}?locale=${locale}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(localizedDoc),
                    });
                    if (patchResult.status > 400) {
                        abort = true;
                        const json = await patchResult.json();
                        json.errors.forEach((error) => toast.error(error.message));
                    }
                }
            });
            if (abort) {
                // delete the duplicate doc to prevent incomplete
                await requests.delete(`${serverURL}${api}/${slug}/${id}`);
            }
        }
        else {
            duplicateID = await create();
        }
        toast.success(`${collection.labels.singular} successfully duplicated.`, { autoClose: 3000 });
        setModified(false);
        setTimeout(() => {
            push({
                pathname: `${admin}/collections/${slug}/${duplicateID}`,
            });
        }, 10);
    }, [modified, localization, collection.labels.singular, setModified, toggle, modalSlug, serverURL, api, slug, id, push, admin]);
    const confirm = useCallback(async () => {
        setHasClicked(false);
        await handleClick(true);
    }, [handleClick]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { id: "action-duplicate", buttonStyle: "none", className: baseClass, onClick: () => handleClick(false) }, "Duplicate"),
        modified && hasClicked && (React.createElement(Modal, { slug: modalSlug, className: `${baseClass}__modal` },
            React.createElement(MinimalTemplate, { className: `${baseClass}__modal-template` },
                React.createElement("h1", null, "Confirm duplicate"),
                React.createElement("p", null, "You have unsaved changes. Would you like to continue to duplicate?"),
                React.createElement(Button, { id: "confirm-cancel", buttonStyle: "secondary", type: "button", onClick: () => toggle(modalSlug) }, "Cancel"),
                React.createElement(Button, { onClick: confirm, id: "confirm-duplicate" }, "Duplicate without saving changes"))))));
};
export default Duplicate;
