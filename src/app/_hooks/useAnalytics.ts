import React, { useState, useEffect, useContext, } from 'react'

import { AnalyticsContext } from '@/app/_contexts/analytics';
import log from '@/app/_utils/log';


export function useAnalytics(flipnotes: any[]) {
  const [hasBeenViewed, setHasBeenViewed] = useState(
    flipnotes.map((fId) => ({ [fId]: false }))
  );
  const { analytics, setAnalytics } = useContext(AnalyticsContext);

  useEffect(() => {
    const monitor = setInterval(() => {
      if (hasBeenViewed) return;
      const elem = document.activeElement;
      const elemIsIframe = elem?.tagName === 'IFRAME';
      if (!elemIsIframe) return;
      clearInterval(monitor);
      const [aUId, aFId] = elem.id.split('-');
      log.info({ aUId, aFId });
      setHasBeenViewed((prev) => {
        return { ...{ [aFId]: true }, ...prev };
      });
      handleAnalyticsUpdate(aUId, aFId, setAnalytics);
    }, 1000 * 15);
  }, []);

  return {
    hasBeenViewed,
    setHasBeenViewed,
    analytics,
    setAnalytics,
  }
}

function handleAnalyticsUpdate(userId: string, flipnoteId: string, update: (p: any) => void) {
  update((prevUsers) => {
    log.info(`Analytics updated for user ${userId}`);
    let increment = 1;

    const isNewUser = !(userId in (prevUsers ?? {}));
    const isNewFlipnote =
      isNewUser || !(flipnoteId in (prevUsers[userId] ?? {}));
    let flipnoteToUpdate = !isNewFlipnote
      ? { [flipnoteId]: prevUsers[userId][flipnoteId] + 1 }
      : { [flipnoteId]: 1 };

    let userToUpdate = !isNewUser
      ? { [userId]: { ...flipnoteToUpdate, ...prevUsers[userId] } }
      : { [userId]: { ...flipnoteToUpdate } };

    if (!isNewFlipnote) increment += prevUsers[userId][flipnoteId];

    const updatedUserAnalytics = {
      ...prevUsers,
      ...userToUpdate,
    };

    return updatedUserAnalytics;
  });
}
