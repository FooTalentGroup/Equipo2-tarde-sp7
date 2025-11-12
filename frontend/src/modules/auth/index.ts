// Server Actions (solo para Client Components)
export {
	loginAction,
	logoutAction,
	registerAction,
} from "./actions/auth.actions";
// Components
export { default as LoginForm } from "./components/login-form";
export { default as RegisterForm } from "./components/register-form";
// Server-only utilities (solo para Server Components/Actions)
export { checkUserRole, getCurrentUser, verifySession } from "./lib/dal";
export { getToken, getUser, hasSession } from "./lib/session";
// Schemas
export { type LoginFormData, loginSchema } from "./schemas/login";
export { type RegisterFormData, registerSchema } from "./schemas/register";
// Types
export type { AuthError, AuthResponse } from "./types";
