import React, { useEffect } from 'react';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import Minimal from '../../templates/Minimal';
import Button from '../../elements/Button';
import Meta from '../../utilities/Meta';

import './index.scss';

const baseClass = 'logout';

const Logout: React.FC<{ inactivity?: boolean }> = (props) => {
    const { inactivity } = props;

    const { logOut } = useAuth();
    const {
        routes: { admin }
    } = useConfig();

    useEffect(() => {
        logOut();
    }, [logOut]);

    return (
        <Minimal className={baseClass}>
            <Meta
                title="Выход из системы"
                description="Выход из системы"
                keywords="Выход из системы, Payload, CMS"
            />
            <div className={`${baseClass}__wrap`}>
                {inactivity && <h2>Вы вышли из системы из-за неактивности.</h2>}
                {!inactivity && <h2>Вы успешно вышли из системы.</h2>}
                <br />
                <Button
                    el="anchor"
                    buttonStyle="secondary"
                    url={`${admin}/login`}
                >
                    Войти снова
                </Button>
            </div>
        </Minimal>
    );
};

export default Logout;
