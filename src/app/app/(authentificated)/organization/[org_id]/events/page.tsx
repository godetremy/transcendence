'use client';
import { OrganizationDashboardTable } from '@/components/organization/OrganizationDashboardTable/OrganizationDashboardTable';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { getEvents } from '@/lib/fetcher/events';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ReactNode, useMemo, useRef, useState } from 'react';

export default function Page() {
	const router = useRouter();
	const orgctx = useOrganizations();
	const [organization, setOrganization] = useState(orgctx.getCurrentOrganization()!);
	
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
		getEvents(organization.id)
	);

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

	const formatDate = (date: string) => {
		const d = new Date(date);
		return `${d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`;
	};

	 const listEvents = useMemo(() => {
        if (!data) return [];

        return data.pages.flatMap((page) =>
            page.data.map((event) => ({
                key: event.id,
                children: [
                    <p key={1}>{formatDate(event.start_at)}</p>,
                    <p key={2}>{event.title}</p>,
                    <p key={3}>{formatDate(event.created_at)}</p>,
                    <p key={4}>{event.owner}</p>,
                    <p key={5}>{event.max_registration == 0 ? '∞' : event.max_registration}</p>,
                    <p key={6}>demo</p>,
                ],
            }))
        );
    }, [data]);

	console.log(data);

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
				data={listEvents}
				onImport={reinitializeEvents}
				onExport={filterEvents}
				onNew={() => router.push('events/new')}
				loading={false}
			/>
			{hasNextPage && (
				<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
					{isFetchingNextPage ? 'Chargement...' : 'Voir la suite'}
				</button>
			)}
		</>
	);
}
