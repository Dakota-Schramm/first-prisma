import { createContext } from 'react';

import type { UserHeaderProps } from '../users/[id]/page';


export const DialogContext = createContext({
  dialogProps: null,
  setDialogProps: (p) => { return },
});

const DialogProvider = ({ value, children }) => {
  return (
    <DialogContext.Provider {...{ value }}>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
