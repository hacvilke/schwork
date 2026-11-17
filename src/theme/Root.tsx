/**
 * Docusaurus Root wrapper — mounts the lightweight <PageLoader /> globally
 * across every page without blocking server-side rendering.
 */

import React from 'react';
import PageLoader from '@site/src/components/PageLoader';

export interface RootProps {
  children: React.ReactNode;
}

export default function Root({children}: RootProps): React.JSX.Element {
  return (
    <>
      <PageLoader />
      {children}
    </>
  );
}
