const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_USER_KEY = "authUser";

export interface AuthUser {
    id: string;
    username: string;
}

interface AuthResponse {
    data: {
        user: AuthUser;
        token: string;
    };
}

interface RegisterResponse {
    data: AuthUser;
}

async function getErrorMessage(
    response: Response,
    fallbackMessage: string
): Promise<string> {
    const errorResponse = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

    return errorResponse?.message ?? fallbackMessage;
}

export function get_access_token(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function get_auth_user(): AuthUser | null {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as AuthUser;
    } catch {
        return null;
    }
}

export function get_auth_headers(): HeadersInit {
    const token = get_access_token();

    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function save_auth_session(user: AuthUser, token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clear_auth_session(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

export async function register_user(
    username: string,
    password: string
): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Unable to register"));
    }

    const result: RegisterResponse = await response.json();
    return result.data;
}

export async function login_user(
    username: string,
    password: string
): Promise<AuthResponse["data"]> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Unable to login"));
    }

    const result: AuthResponse = await response.json();
    save_auth_session(result.data.user, result.data.token);
    return result.data;
}
