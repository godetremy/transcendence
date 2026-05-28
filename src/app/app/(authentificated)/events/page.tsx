'use client';

import { CreateEvent } from "@/database/event/createEvent";
import { EventFormSchema, EventSearchFormSchema } from "@/schema/EventForm";
import { Event } from "@/types/bde/Event";
import { useEffect, useState } from "react";

function Card({ event }: { event: Event; }) {
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
						body : JSON.stringify({
							id: event.id,
						})
					});
				}}
			>
				suppression
			</button>
			<button
				onClick={async () => {
					console.log('subscribe');
				}}
			>
				subscribe
			</button>
			<button
				onClick={async () => {
					console.log('unsubscribe');
				}}
			>
				unsubscribe
			</button>
			<br></br>
		</div>
	);
}

function CardList({ from, to, limit }: { from: Date | undefined, to: Date | undefined, limit: number | undefined}) {
	const [events, setEvents] = useState<Event[]>();

	useEffect(() => {
		const fetchEvents = async () => {
			const response = await fetch(`/app/api/events?from=${from?.toISOString()}&to=${to?.toISOString()}&limit=${limit?.toString()}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
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
				<Card key={index} event={item}/>
			))}
		</div>
	);
}

export default function Page() {
	const [from, setFrom] = useState<Date>();
	const [to, setTo] = useState<Date>();
	const [limit, setLimit] = useState<number>();
	const [searched, setSearched] = useState<boolean>(false);

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
		if (fields.data == null) return ;
		const value = await CreateEvent(fields.data);
		console.log(value);
	}

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
		if (fields.data == null) return ;
		setFrom(fields.data.from);
		setTo(fields.data.to);
		setLimit(fields.data.limit);
		setSearched(true);
	}

	return (
		<>
			<form action={create}>
				<p>Titre</p>
				<input type="text" placeholder="titre" name="title"></input>
				<p>description</p>
				<input type="text" placeholder="description" name="describe"></input>
				<p>debut</p>
				<input type="datetime-local" name="start"></input>
				<p>fin</p>
				<input type="datetime-local" name="end"></input>
				<p>Nombre de personne</p>
				<input type="number" name="max_inscription"></input>
				<button type="submit">créer</button>
			</form>
			<h1>
				search event
				<form action={search}>
					<p>debut</p>
					<input type="date" name="from"></input>
					<p>fin</p>
					<input type="date" name="to"></input>
					<p>limit</p>
					<input type="number" name="limit"></input>
					<button type="submit">find</button>
				</form>
				{ searched && from && to 
                	? <CardList from={new Date(from)} to={new Date(to)} limit={limit} />
                	: <p>Lancez une recherche</p>
            	}
			</h1>
		</>
	);
}
