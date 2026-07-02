import { searchEvents } from '@/database/EventSearch';

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
	const { q = '' } = await searchParams;
	const events = q ? await searchEvents(q) : [];

	return (
		<>
			<form>
				<input type="search" name="q" defaultValue={q} placeholder="Rechercher un évènement…" />
				<button type="submit">Rechercher</button>
			</form>
			{q ? (
				<p>
					{events.length} résultat(s) pour « {q} »
				</p>
			) : null}
			<table>
				<thead>
					<tr>
						<th>Titre</th>
						<th>Lieu</th>
						<th>Début</th>
					</tr>
				</thead>
				<tbody>
					{events.map((event) => (
						<tr key={event.id}>
							<td>{event.title}</td>
							<td>{event.location}</td>
							<td>{event.start_at}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
