const get = async <T>(route: string): Promise<T> => {
	const f = await fetch(`/app/api${route}`, {
		method: 'GET',
	});
	const j = await f.json();
	return j as T;
};

const post = async <T>(route: string, body: object): Promise<T> => {
	const f = await fetch(`/app/api${route}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	const j = await f.json();
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
	return j as T;
};

export { get, post, put };
