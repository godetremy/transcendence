'use client';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';
import { OrganizationDashboardTable } from '@/components/organization/OrganizationDashboardTable/OrganizationDashboardTable';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { getEvents } from '@/lib/fetcher/events';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

export default function Page() {
	const router = useRouter();
	const orgctx = useOrganizations();
	const [organization] = useState(orgctx.getCurrentOrganization()!);
	const [activeMenu, setActiveMenu] = useState<number>(0);
	const [search, setSearch] = useState<string>('');

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
		getEvents(
			organization.id,
			activeMenu == 2 ? null : new Date().toISOString(),
			activeMenu == 0 ? null : activeMenu == 2 ? new Date().toISOString() : addDays(new Date(), 7).toISOString(),
			search,
			activeMenu
		)
	);

	const fileInputRef = useRef<HTMLInputElement>(null);

	function addDays(date: Date, days: number): Date {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const formData = new FormData();
			formData.append('file', file);
			formData.append('name', file.name);

			await fetch(`/app/api/organization/${organization.id}/events/import`, {
				method: 'POST',
				body: formData,
			});

			e.target.value = '';
		},
		[organization.id]
	);

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const importEvents = () => {};

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
					<p key={5}>
						{event.max_registration == null
							? '--'
							: `${event.register_number}/${event.max_registration == 0 ? '∞' : event.max_registration}`}
					</p>,
					<p key={6}>demo</p>,
				],
			}))
		);
	}, [data]);

	return (
		<>
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
				accept=".csv,.xlsx"
			/>
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
				onImport={openFilePicker}
				onExport={openFilePicker}
				onNew={() => router.push('events/new')}
				loading={false}
				activeMenu={activeMenu}
				onActiveMenuChange={setActiveMenu}
				onSearch={setSearch}
			/>
			{hasNextPage && <ShowMoreButton onClick={() => fetchNextPage()} loading={isFetchingNextPage} />}
		</>
	);
}
