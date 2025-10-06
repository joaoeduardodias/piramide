import type {
  ConfirmPasswordResetRequest,
  ConfirmPasswordResetResponse,
  GetProfileResponse,
  LoginGoogleRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse
} from "@/types/auth";
import { destroyCookie } from "nookies";
import { api } from "../api";

export const authService = {
  async signIn(data: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>("/sessions/password", data)
  },
  async signInWithGoogle(data: LoginGoogleRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>("/sessions/google", data)
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return api.post<RegisterResponse>("/users", data)
  },

  async requestPasswordReset(data: RequestPasswordResetRequest): Promise<RequestPasswordResetResponse> {
    return api.post<RequestPasswordResetResponse>("/auth/password/recover", data)
  },

  async confirmPasswordReset(data: ConfirmPasswordResetRequest): Promise<ConfirmPasswordResetResponse> {
    return api.post<ConfirmPasswordResetResponse>("/auth/password/reset", data)
  },

  async getProfile(): Promise<GetProfileResponse> {
    return api.get<GetProfileResponse>("/auth/me", {
      cache: "no-store", // Sempre buscar dados atualizados do perfil
    })
  },


  logout() {
    if (typeof window !== "undefined") {
      destroyCookie(null, "token", { path: "/" })
    }
  },
}
