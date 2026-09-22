import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

interface RouterContextValue {
  pathname: string;
  searchParams: URLSearchParams;
  navigate: (url: string) => void;
  replace: (url: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentUrl, setCurrentUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname + window.location.search;
    }
    return "/";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((url: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", url);
      setCurrentUrl(url);
    }
  }, []);

  const replace = useCallback((url: string) => {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", url);
      setCurrentUrl(url);
    }
  }, []);

  const { pathname, searchParams } = useMemo(() => {
    try {
      const parsed = new URL(currentUrl, "http://localhost");
      return {
        pathname: parsed.pathname,
        searchParams: parsed.searchParams,
      };
    } catch {
      return {
        pathname: currentUrl,
        searchParams: new URLSearchParams(),
      };
    }
  }, [currentUrl]);

  return (
    <RouterContext.Provider value={{ pathname, searchParams, navigate, replace }}>
      {children}
    </RouterContext.Provider>
  );
}

export function usePathname(): string {
  const ctx = useContext(RouterContext);
  if (ctx) return ctx.pathname;
  if (typeof window !== "undefined") return window.location.pathname;
  return "/";
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  return useMemo(() => ({
    push: (url: string) => {
      if (ctx) ctx.navigate(url);
      else if (typeof window !== "undefined") {
        window.history.pushState({}, "", url);
      }
    },
    replace: (url: string) => {
      if (ctx) ctx.replace(url);
      else if (typeof window !== "undefined") {
        window.history.replaceState({}, "", url);
      }
    },
    back: () => {
      if (typeof window !== "undefined") window.history.back();
    },
    forward: () => {
      if (typeof window !== "undefined") window.history.forward();
    },
    prefetch: () => {},
  }), [ctx]);
}

export function useSearchParams(): URLSearchParams {
  const ctx = useContext(RouterContext);
  if (ctx) return ctx.searchParams;
  if (typeof window !== "undefined") return new URLSearchParams(window.location.search);
  return new URLSearchParams();
}
