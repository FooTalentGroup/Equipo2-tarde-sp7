const BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	(typeof window === "undefined" ? "http://localhost:8000/api" : "/api");

type RequestOptions = RequestInit & {
	params?: Record<string, string>;
};

async function request<T>(
	endpoint: string,
	{ params, ...options }: RequestOptions = {},
): Promise<T> {
	const baseUrl = (endpoint.startsWith("http") ? "" : BASE_URL).replace(
		/\/$/,
		"",
	);
	const cleanEndpoint = endpoint.startsWith("http")
		? endpoint
		: endpoint.startsWith("/")
			? endpoint
			: `/${endpoint}`;

	const finalUrlString = endpoint.startsWith("http")
		? endpoint
		: `${baseUrl}${cleanEndpoint}`;

	// Handle server-side relative URLs
	if (typeof window === "undefined" && !finalUrlString.startsWith("http")) {
		console.error(
			"[API] Critical Error: Relative URL on server.",
			`Final URL: ${finalUrlString}`,
			`BASE_URL: ${BASE_URL}`,
			`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`,
		);
		throw new Error(
			`Cannot make relative requests on the server. URL: ${finalUrlString}. Please set NEXT_PUBLIC_API_URL to an absolute URL.`,
		);
	}

	const url = new URL(
		finalUrlString,
		typeof window !== "undefined" ? window.location.origin : undefined,
	);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
	}

	const headers = new Headers(options.headers);

	if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
		headers.set("Content-Type", "application/json");
	}

	console.log(`[API] ${options.method || "GET"} ${url.toString()}`);

	try {
		const response = await fetch(url.toString(), {
			...options,
			headers,
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			console.error("[API] Error response:", response.status, error);
			throw new Error(
				error.message || `Request failed with status ${response.status}`,
			);
		}

		// Handle 204 No Content
		if (response.status === 204) {
			return {} as T;
		}

		return response.json();
	} catch (error) {
		console.error("[API] Fetch error:", error);
		throw error;
	}
}

export class ApiConnector {
	private static instance: ApiConnector;

	private constructor() {}

	public static getInstance(): ApiConnector {
		if (!ApiConnector.instance) {
			ApiConnector.instance = new ApiConnector();
		}
		return ApiConnector.instance;
	}

	public async get<T>(endpoint: string, options?: RequestOptions) {
		const data = await request<T>(endpoint, { ...options, method: "GET" });
		return { data };
	}

	public async post<T>(
		endpoint: string,
		body: unknown,
		options?: RequestOptions,
	) {
		const data = await request<T>(endpoint, {
			...options,
			method: "POST",
			body: body instanceof FormData ? body : JSON.stringify(body),
		});
		return { data };
	}

	public async put<T>(
		endpoint: string,
		body: unknown,
		options?: RequestOptions,
	) {
		const data = await request<T>(endpoint, {
			...options,
			method: "PUT",
			body: body instanceof FormData ? body : JSON.stringify(body),
		});
		return { data };
	}

	public async patch<T>(
		endpoint: string,
		body: unknown,
		options?: RequestOptions,
	) {
		const data = await request<T>(endpoint, {
			...options,
			method: "PATCH",
			body: body instanceof FormData ? body : JSON.stringify(body),
		});
		return { data };
	}

	public async delete<T>(endpoint: string, options?: RequestOptions) {
		const data = await request<T>(endpoint, { ...options, method: "DELETE" });
		return { data };
	}
}

export const api = {
	get: <T>(endpoint: string, options?: RequestOptions) =>
		ApiConnector.getInstance()
			.get<T>(endpoint, options)
			.then((res) => res.data),
	post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
		ApiConnector.getInstance()
			.post<T>(endpoint, body, options)
			.then((res) => res.data),
	put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
		ApiConnector.getInstance()
			.put<T>(endpoint, body, options)
			.then((res) => res.data),
	patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
		ApiConnector.getInstance()
			.patch<T>(endpoint, body, options)
			.then((res) => res.data),
	delete: <T>(endpoint: string, options?: RequestOptions) =>
		ApiConnector.getInstance()
			.delete<T>(endpoint, options)
			.then((res) => res.data),
};
