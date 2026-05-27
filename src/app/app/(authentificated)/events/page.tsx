'use client';

import { CreateEvent } from "@/database/event/createEvent";
import { EventFormSchema } from "@/schema/EventForm";

export default function Page() {

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
		</>
	);
}
