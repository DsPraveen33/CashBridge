/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider } from './context/AppContext';
import { MobileShell } from './components/mobileApp/MobileShell';

export default function App() {
  return (
    <AppProvider>
      <MobileShell />
    </AppProvider>
  );
}
