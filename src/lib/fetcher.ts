const get = async <T>(route: string): Promise<T> => {
	const f = await fetch(`/app/api${route}`, {
		method: 'GET',
	});
	const j = await f.json();
	if (!f.ok) throw new Error(j.message);
	return j as T;
};

const post = async <T>(route: string, body: object, parse: boolean = true, stringify: boolean = true): Promise<T> => {
	const f = await fetch(`/app/api${route}`, {
		method: 'POST',
		headers: stringify ? { 'Content-Type': 'application/json' } : {},
		body: stringify ? JSON.stringify(body) : (body as BodyInit),
	});
	if (parse == false) return f as T;
	const j = await f.json();
	if (!f.ok) throw new Error(j.message);
	return j as T;
};

const patch = async <T>(route: string, body: object): Promise<T> => {
	const f = await fetch(`/app/api${route}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	const j = await f.json();
	if (!f.ok) throw new Error(j.message);
	return j as T;
};

const put = async <T>(route: string, body: object): Promise<T> => {
	const f = await fetch(`/app/api${route}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	const j = await f.json();
	if (!f.ok) throw new Error(j.message);
	return j as T;
};

const deletef = async <T>(route: string, body: object): Promise<T> => {
	const f = await fetch(`/app/api${route}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	const j = await f.json();
	if (!f.ok) throw new Error(j.message);
	return j as T;
};

const sse = <T>(route: string, onMessage: (data: T) => void, onError?: (error: Event) => void): (() => void) => {
	const eventSource = new EventSource(`/app/api${route}`);

	eventSource.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data) as T;
			onMessage(data);
		} catch {}
	};

	if (onError) {
		eventSource.onerror = onError;
	}

	return () => {
		eventSource.close();
	};
};

export { get, post, patch, put, deletef, sse };
