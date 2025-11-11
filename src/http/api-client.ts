import { getCookie } from "cookies-next";
import ky from "ky";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export const api = ky.create({
  prefixUrl: API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined;

        if (typeof window !== "undefined") {

          token = getCookie("token") as string | undefined;
        } else {
          const { cookies } = await import("next/headers");
          try {
            const cookieStore = await cookies();
            token = cookieStore.get("token")?.value;
          } catch {
            token = undefined;
          }
        }

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],

    // afterResponse: [
    //   (_request, _options, response) => {
    //     if (response.status === 401 && typeof window !== "undefined") {
    //       window.location.href = "/api/auth/sign-out";
    //     }
    //     return response;
    //   },
    // ],
  },
});
