import { createContext } from 'react';

const AnalyticsContext = createContext({
  analytics: [],
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
