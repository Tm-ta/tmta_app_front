import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ConfirmOverlay } from './ConfirmOverlay';
import { CONFIRM_CASES, ConfirmCaseKey } from '../../constants/confirmCases';

type ShowConfirmOptions = {
  override?: Partial<(typeof CONFIRM_CASES)[ConfirmCaseKey]>;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

type ConfirmContextValue = {
  showConfirm: (caseKey: ConfirmCaseKey, options?: ShowConfirmOptions) => void;
  hideConfirm: () => void;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const [caseKey, setCaseKey] = useState<ConfirmCaseKey>('logout');
  const [options, setOptions] = useState<ShowConfirmOptions | undefined>(undefined);

  const hideConfirm = useCallback(() => {
    setVisible(false);
    setOptions(undefined);
  }, []);

  const showConfirm = useCallback((key: ConfirmCaseKey, opts?: ShowConfirmOptions) => {
    setCaseKey(key);
    setOptions(opts);
    setVisible(true);
  }, []);

  const data = useMemo(() => {
    const base = CONFIRM_CASES[caseKey];
    const override = options?.override ?? {};
    return { ...base, ...override };
  }, [caseKey, options]);

  return (
    <ConfirmContext.Provider value={{ showConfirm, hideConfirm }}>
      {children}

      <ConfirmOverlay
        visible={visible}
        data={data}
        onClose={hideConfirm}
        onLeftPress={options?.onLeftPress}
        onRightPress={options?.onRightPress}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}