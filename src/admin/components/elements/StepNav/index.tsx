import React, {
  useState, createContext, useContext,
} from 'react';
import { Link } from 'react-router-dom';
import Chevron from '../../icons/Chevron';
import { Context as ContextType } from './types';

import './index.scss';

const Context = createContext({} as ContextType);

const StepNavProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  const [stepNav, setStepNav] = useState([]);

  return (
    <Context.Provider value={{
      stepNav,
      setStepNav,
    }}
    >
      {children}
    </Context.Provider>
  );
};

const useStepNav = (): ContextType => useContext(Context);

const StepNav: React.FC = () => {
  const dashboardLabel = <span>Панель управления</span>;
  const { stepNav } = useStepNav();

  return (
    <nav className="step-nav">
      {stepNav.length > 0
        ? (
          <Link to="/admin">
            {dashboardLabel}
            <Chevron />
          </Link>
        )
        : dashboardLabel}
      {stepNav.map((item, i) => {
        const StepLabel = <span key={i}>{item.label}</span>;

        const Step = stepNav.length === i + 1
          ? StepLabel
          : (
            <Link
              to={item.url}
              key={i}
            >
              {StepLabel}
              <Chevron />
            </Link>
          );

        return Step;
      })}
    </nav>
  );
};

export {
  StepNavProvider,
  useStepNav,
};

export default StepNav;
