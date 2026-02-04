import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ErrorPopup } from '../ErrorPopup';
import { POPUP_MESSAGE, PopupMessageKey } from '../../constants/popupMessages';
import ErrorIcon  from '../../assets/icons/Error.svg';

type ErrorPopupPayload = {
  message: string;
};

type ErrorPopupContextValue = {
  showErrorPopup: (keyOrMessage: PopupMessageKey | string, icon?: React.ReactNode) => void;
  hideErrorPopup: () => void;
};

const ErrorPopupContext = createContext<ErrorPopupContextValue | null>(null);

export function ErrorPopupProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<ErrorPopupPayload>({ message: '' });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // useEffect(() => {
  //   console.log('[ErrorPopupProvider] visible changed:', visible);
  // }, [visible]);
  // useEffect(() => {
  //   console.log('[!ErrorPopupProvider] payload:', payload.message);
  // }, [payload.message]);

  // 1.5초 후 팝업 종료
  const hideErrorPopup = useCallback(() => {
    setVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showErrorPopup = useCallback((keyOrMessage: PopupMessageKey | string) => {
    // console.log('[ErrorPopupProvider-show] showErrorPopup called:');
  
    const message =
      keyOrMessage in POPUP_MESSAGE
        ? POPUP_MESSAGE[keyOrMessage as PopupMessageKey]
        : keyOrMessage;

    setPayload({ message });
    setVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      timerRef.current = null;
    }, 1500); // 시간 초
  }, []);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <ErrorPopupContext.Provider value={{ showErrorPopup, hideErrorPopup }}>
      {children}

      <ErrorPopup
        visible={visible}
        message={payload.message}
        icon={<ErrorIcon width={20} height={20} />}
        onClose={hideErrorPopup}
      />
    </ErrorPopupContext.Provider>
  );
}

export function useErrorPopup() {
  const ctx = useContext(ErrorPopupContext);
  if (!ctx) throw new Error('useErrorPopup must be used within PopupProvider');
  return ctx;
}