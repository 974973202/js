import React, { useContext } from 'react';
/**
 * Global state context
 */
export const initialGlobalState: Record<string, any> = {
  menuUpdated: false,
};

export const GlobalStateContext = React.createContext({
  ...initialGlobalState,
});
export const GlobalStateUpdaterContext = React.createContext<any>({});

/**
 * Global state hook
 */
export const useGlobalState = () => {
  const globalState = useContext(GlobalStateContext);
  const updater = useContext(GlobalStateUpdaterContext);

  const updateGlobalState = (state: Record<string, any>) => {
    updater?.updateState(state);
  };

  return {
    globalState,
    updateGlobalState,
  };
};

// other components
// const { globalState, updateGlobalState } = useGlobalState();
// useEffect(() => {
//   if (globalState.menuUpdated) {
//     updateGlobalState({ menuUpdated: false });
//   }
// }, [globalState])