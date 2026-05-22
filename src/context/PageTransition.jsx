import { createContext, useContext, useState, useCallback } from "react";

const PageTransitionContext = createContext(null);

export const PageTransitionProvider = ({ children }) => {
  const [pending, setPending] = useState(null);

  const trigger = useCallback((x, y, path, scrollToId = null) => {
    setPending({ x, y, path, scrollToId });
  }, []);

  const clear = useCallback(() => setPending(null), []);

  return (
    <PageTransitionContext.Provider value={{ pending, trigger, clear }}>
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => useContext(PageTransitionContext);
