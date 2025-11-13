import { useCallback } from "react";


export function useToken() {
  const getToken = useCallback(async (): Promise<string | undefined> => {
    try {
      const { getCookie } = await import("cookies-next/client");
      return getCookie("token") as string | undefined;
    } catch {
      return undefined;
    }
  }, []);

  return { getToken };
}
