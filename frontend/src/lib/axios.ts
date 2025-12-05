import { env } from "@src/config/env";

type RequestOptions = {
	method?: string;
	headers?: Record<string, string>;
	body?: unknown;
	params?: Record<string, string | number | boolean | undefined | null>;
	cache?: RequestCache;
	next?: NextFetchRequestConfig;
};

function buildUrlWithParams(
	url: string,
	params?: RequestOptions["params"],
): string {
	if (!params) return url;
	const filteredParams = Object.fromEntries(
		Object.entries(params).filter(
			([, value]) => value !== undefined && value !== null,
		),
	);
	if (Object.keys(filteredParams).length === 0) return url;
	const queryString = new URLSearchParams(
		filteredParams as Record<string, string>,
	).toString();
	return `${url}?${queryString}`;
}

async function getAuthToken(): Promise<string | undefined> {
	if (typeof window === "undefined") {
		try {
			const { cookies } = await import("next/headers");
			const cookieStore = await cookies();
			return cookieStore.get("auth_token")?.value;
		} catch (error) {
			console.warn("Error accediendo a cookies en el servidor:", error);
			return undefined;
		}
	} else {
		return localStorage.getItem("auth_token") || undefined;
	}
}

async function fetchApi<T>(
	endpoint: string,
	options: RequestOptions = {},
): Promise<T> {
	const {
		method = "GET",
		headers = {},
		body,
		params,
		cache = "no-store",
		next,
	} = options;

	const defaultHeaders: Record<string, string> = {
		Accept: "application/json",
	};

	if (!headers.Authorization) {
		const token = await getAuthToken();
		if (token) {
			defaultHeaders.Authorization = `Bearer ${token}`;
		}
	}

	const isFormData = body instanceof FormData;

	if (!isFormData) {
		defaultHeaders["Content-Type"] = "application/json";
	}

	const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const baseUrl = env.NEXT_PUBLIC_API_URL;
	const fullUrl = endpoint.startsWith("http")
		? endpoint
		: buildUrlWithParams(`${baseUrl}${cleanEndpoint}`, params);

	const response = await fetch(fullUrl, {
		method,
		headers: {
			...defaultHeaders,
			...headers,
		},
		body: isFormData
			? (body as BodyInit)
			: body
				? JSON.stringify(body)
				: undefined,
		credentials: "include",
		cache,
		next,
	});

	if (!response.ok) {
		let errorMessage = response.statusText;
		try {
			const errorData = await response.json();
			errorMessage = errorData.message || errorData.error || errorMessage;
		} catch {
			// Si no es JSON, usar statusText
		}

		if (response.status === 401) {
			if (typeof window === "undefined") {
				const { cookies } = await import("next/headers");
				const { redirect } = await import("next/navigation");
				const cookieStore = await cookies();
				cookieStore.delete("auth_token");
				cookieStore.delete("auth_user");
				redirect("/login");
			} else {
				window.location.href = "/login";
			}
		}

		throw new Error(errorMessage);
	}

	if (response.status === 204) return {} as T;

	return response.json();
}

export const api = {
	get<T>(url: string, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: "GET" });
	},
	post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: "POST", body });
	},
	put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: "PUT", body });
	},
	patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: "PATCH", body });
	},
	delete<T>(url: string, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: "DELETE" });
	},
};
