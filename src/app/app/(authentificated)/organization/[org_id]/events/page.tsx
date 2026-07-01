'use client';
import { OrganizationDashboardTable } from '@/components/organization/OrganizationDashboardTable/OrganizationDashboardTable';
import { useRouter } from 'next/navigation';
import { ReactNode, useRef, useState } from 'react';

export default function Page() {
	const router = useRouter();

	const [events, setEvents] = useState<Array<{ key: string; children: ReactNode[] }>>([]);

	const filterEvents = () => {
		setEvents(events.filter((event, i) => i % 3));
	};

	const id = useRef(0);

	const reinitializeEvents = () => {
		const array: Array<{ key: string; children: ReactNode[] }> = [];
		for (let i = 0; i < 10; i++) {
			array.push({
				key: id.current.toString(),
				children: [
					<p key={1}>Demo</p>,
					<p key={2}>Demo</p>,
					<p key={3}>Demo</p>,
					<p key={4}>Demo</p>,
					<p key={5}>Demo</p>,
					<p key={6}>Demo</p>,
				],
			});
			id.current = id.current + 1;
		}
		setEvents([...events, ...array]);
	};

	return (
		<>
			<OrganizationDashboardTable
				header={{
					title: `Events`,
					menu: [{ text: 'À venir' }, { text: 'Dans la semaine' }, { text: 'Passée' }],
				}}
				column={[
					{ text: 'Date', width: 70 },
					{ text: 'Nom de l’événement' },
					{ text: 'Crée le', width: 80 },
					{ text: 'Crée par', width: 200 },
					{ text: 'Inscrits', width: 100 },
					{ text: '', width: 50 },
				]}
				data={events}
				onImport={reinitializeEvents}
				onExport={filterEvents}
				onNew={() => router.push('events/new')}
				loading={false}
			/>
		</>
	);
}
