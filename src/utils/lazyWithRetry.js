import React from 'react';

/**
 * Wraps React.lazy to gracefully handle chunk load errors (e.g. when a new build/deploy changes asset hashes).
 * Automatically reloads the page once to pull the fresh index.html & new asset manifest.
 */
export const lazyWithRetry = (componentImport) =>
  React.lazy(async () => {
    const pageHasBeenRefreshed = JSON.parse(
      window.sessionStorage.getItem('page_has_been_refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page_has_been_refreshed', 'false');
      return component;
    } catch (error) {
      console.warn('⚠️ Dynamic chunk load failed (likely new deployment):', error);

      if (!pageHasBeenRefreshed) {
        window.sessionStorage.setItem('page_has_been_refreshed', 'true');
        window.location.reload();
        return new Promise(() => {}); // never resolves, page reloads
      }

      throw error;
    }
  });

export default lazyWithRetry;
