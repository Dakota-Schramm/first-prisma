import { createContext } from 'react';

type Analytics = {
  [key: string]: { [key: string]: number; };
};

export const AnalyticsContext = createContext({
  analytics: {},
  setAnalytics: () => {},
});

const AnalyticsProvider = ({ value, children }) => {
  return (
    <AnalyticsContext.Provider {...{ value }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
