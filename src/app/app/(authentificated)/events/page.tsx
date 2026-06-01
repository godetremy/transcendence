'use client';

import './page.scss';
import { EventFormSchema, EventSearchFormSchema } from '@/schema/EventForm';
import { CreateEventType, Event } from '@/types/bde/Event';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function Basic({ event }: { event: Event }) {
	const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
		const file = acceptedFiles[0];

		const formData = new FormData();
		formData.append('file', file);
		formData.append('name', file.name);

		await fetch(`/app/api/events/${event.id}/photos/download`, {
			method: 'POST',
			body: formData,
		});
	}, []);
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop });

	const report = async (form: FormData) => {
		const reason = form.get('reason');
		if (!reason) {
			console.error("Error: reason not set");
			return;
		}
		await fetch(`/app/api/events/${event.id}/photos/report`, {
			method: 'POST',
			headers: {
					'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: acceptedFiles[0].name,
				reason: reason,
			}),
		});
	};

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
			<button
				onClick={async () => {
					await fetch(`/app/api/events/${event.id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							name: file.name,
						}),
					});
					console.log('delete');
				}}
			>
				suppression
			</button>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					report(formData);
				}}
				>
				<p>raison</p>
				<input type="text" name="reason"></input>
				<button type="submit">find</button>
			</form>
		</li>
	));

	return (
		<section className="container">
			<div {...getRootProps({ className: 'dropzone' })}>
				<input {...getInputProps()} />
				<p>Drag and drop some files here, or click to select files</p>
			</div>
			<aside>
				<h4>Files</h4>
				<ul>{files}</ul>
			</aside>
		</section>
	);
}

function Card({ event, eventmodify }: { event: Event; eventmodify: CreateEventType }) {
	return (
		<div className="card">
			<h2>Nom</h2>
			<p>{event.title}</p>
			<h2>description</h2>
			<p>{event.description}</p>
			<h2>max_inscription</h2>
			<p>{event.max_inscription}</p>
			<button
				onClick={async () => {
					await fetch(`/app/api/events/${event.id}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							title: eventmodify.title,
							description: eventmodify.description,
							max_inscription: eventmodify.max_inscription,
							start_at: eventmodify.start_at,
							end_at: eventmodify.end_at,
						}),
					});
					console.log('modifier');
				}}
			>
				modifier
			</button>
			<button
				onClick={async () => {
					await fetch(`/app/api/events`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							id: event.id,
						}),
					});
					console.log('delete');
				}}
			>
				suppression
			</button>
			<button
				onClick={async () => {
					await fetch(`/app/api/events/${event.id}/subscribe`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					});
					console.log('subscribe');
				}}
			>
				subscribe
			</button>
			<button
				onClick={async () => {
					await fetch(`/app/api/events/${event.id}/unsubscribe`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					});
					console.log('unsubscribe');
				}}
			>
				unsubscribe
			</button>
			<Basic event={event} />
			<br></br>
		</div>
	);
}

function CardList({
	from,
	to,
	limit,
	event,
}: {
	from: Date | undefined;
	to: Date | undefined;
	limit: number | undefined;
	event: CreateEventType;
}) {
	const [events, setEvents] = useState<Event[]>();

	useEffect(() => {
		const fetchEvents = async () => {
			const response = await fetch(
				`/app/api/events?from=${from?.toISOString()}&to=${to?.toISOString()}&limit=${limit?.toString()}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response.ok) {
				const value = await response.json();
				setEvents(value);
				return;
			}
			return;
		};

		fetchEvents();
	}, [from, to, limit]);

	return (
		<div>
			{events?.map((item, index) => (
				<Card key={index} event={item} eventmodify={event} />
			))}
		</div>
	);
}

export default function Page() {
	const [from, setFrom] = useState<Date>();
	const [to, setTo] = useState<Date>();
	const [limit, setLimit] = useState<number>();
	const [searched, setSearched] = useState<boolean>(false);
	const [event, setEvent] = useState<CreateEventType>({
		title: '',
		description: '',
		max_inscription: 0,
		start_at: new Date(),
		end_at: new Date(),
	});

	const create = async (form: FormData) => {
		const fields = EventFormSchema.safeParse({
			title: form.get('title'),
			description: form.get('describe'),
			start_at: form.get('start'),
			end_at: form.get('end'),
			max_inscription: form.get('max_inscription'),
		});
		if (!fields.success) {
			console.log(fields.error.issues[0].message);
			return;
		}
		if (fields.data == null) return;
		const value = await fetch(`/app/api/events`, {
			method: 'POST',
			body: JSON.stringify({
				title: fields.data.title,
				description: fields.data.description,
				max_inscription: fields.data.max_inscription,
				start_at: fields.data.start_at,
				end_at: fields.data.end_at,
			}),
		});
		console.log(value);
	};

	const search = (form: FormData) => {
		const fields = EventSearchFormSchema.safeParse({
			from: form.get('from'),
			to: form.get('to'),
			limit: form.get('limit'),
		});
		if (!fields.success) {
			console.log(fields.error.issues[0].message);
			return;
		}
		if (fields.data == null) return;
		setFrom(fields.data.from);
		setTo(fields.data.to);
		setLimit(fields.data.limit);
		setSearched(true);
	};

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					create(formData);
				}}
			>
				<p>Titre</p>
				<input
					type="text"
					placeholder="titre"
					name="title"
					onChange={(e) => setEvent({ ...event, title: e.target.value })}
				></input>
				<p>description</p>
				<input
					type="text"
					placeholder="description"
					name="describe"
					onChange={(e) => setEvent({ ...event, description: e.target.value })}
				></input>
				<p>debut</p>
				<input
					type="datetime-local"
					name="start"
					onChange={(e) => setEvent({ ...event, start_at: new Date(e.target.value) })}
				></input>
				<p>fin</p>
				<input
					type="datetime-local"
					name="end"
					onChange={(e) => setEvent({ ...event, end_at: new Date(e.target.value) })}
				></input>
				<p>Nombre de personne</p>
				<input
					type="number"
					name="max_inscription"
					onChange={(e) => setEvent({ ...event, max_inscription: Number(e.target.value) })}
				></input>
				<button type="submit">créer</button>
			</form>
			<div className="search">
				<h2>search event</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						search(formData);
					}}
				>
					<p>debut</p>
					<input type="date" name="from"></input>
					<p>fin</p>
					<input type="date" name="to"></input>
					<p>limit</p>
					<input type="number" name="limit"></input>
					<button type="submit">find</button>
				</form>
				{searched && from && to ? (
					<CardList from={new Date(from)} to={new Date(to)} limit={limit} event={event} />
				) : (
					<p>Not found</p>
				)}
			</div>
		</>
	);
}
