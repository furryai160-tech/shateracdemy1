'use client';

import { useEffect } from 'react';
import disableDevtool from 'disable-devtool';

export default function DevToolsBlocker() {
  useEffect(() => {
    disableDevtool({
      // You can customize the behavior here
      disableMenu: true,
      disableSelect: false,
      disableCopy: false,
      disableCut: false,
      disablePaste: false,
      clearLog: true,
      disableIframeParents: true,
    });
  }, []);

  return null;
}
