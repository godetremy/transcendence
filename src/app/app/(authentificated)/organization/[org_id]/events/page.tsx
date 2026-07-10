'use client';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';
import { OrganizationDashboardTable } from '@/components/organization/OrganizationDashboardTable/OrganizationDashboardTable';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { getEvents } from '@/lib/fetcher/events';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { MenuButton } from '@/components/globals/MenuButton/MenuButton';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { PrivateEvent } from '@/types/Event';

export default function Page() {
	const router = useRouter();
	const orgctx = useOrganizations();
	const modal = useModal();
	const organization = orgctx.getCurrentOrganization()!;

	const [activeMenu, setActiveMenu] = useState<number>(0);
	const [search, setSearch] = useState<string>('');

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery(
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

	const exportEvents = useCallback(async () => {
		try {
			const response = await fetch(`/app/api/organization/${organization.id}/events/export`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					type: 'xlsx',
					filename: 'events',
				}),
			});

			if (!response.ok) {
				throw new Error('Export failed');
			}

			const blob = await response.blob();

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'events.xlsx';
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Erreur lors de l'export:", error);
		}
	}, [organization.id]);

	const formatDate = (date: string) => {
		const d = new Date(date);
		return `${d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`;
	};

	const deleteEvent = async (event: PrivateEvent<object>) => {
		modal.openModal({
			title: `Veux-tu vraiment supprimer « ${event.title} » ?`,
			message: 'Attention, une fois supprimer tu ne pourras pas le récupérer.',
			buttons: [
				{ text: 'Je le laisse' },
				{ negative: true, text: 'Supprimer cette événement', onClick: () => {} },
			],
		});
	};

	const listEvents = useMemo(() => {
		if (!data) return [];

		return data.pages.flatMap((page, page_index) =>
			page.data.map((event, index) => ({
				key: `${page_index}_${index}`,
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
					<MenuButton
						key={index}
						containerKey={`${page_index}_${index}`}
						alignRight={true}
						menu={[
							{
								title: 'Modifier',
								icon: Pencil,
								onClick: () => {},
							},
							{
								title: 'Supprimer',
								icon: Trash2,
								negative: true,
								onClick: async () => deleteEvent(event),
							},
						]}
					/>,
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
				accept=".csv,.xlsx,.json"
			/>
			<OrganizationDashboardTable
				header={{
					title: `Events`,
					menu: [{ text: 'À venir' }, { text: 'Dans la semaine' }, { text: 'Passée' }],
				}}
				column={[
					{ id: 'date', text: 'Date', width: 70 },
					{ id: 'name', text: 'Nom de l’événement' },
					{ id: 'created_at', text: 'Crée le', width: 80 },
					{ id: 'created_by', text: 'Crée par', width: 200 },
					{ id: 'register', text: 'Inscrits', width: 100 },
					{ text: '', width: 50, sortable: false },
				]}
				data={listEvents}
				onImport={openFilePicker}
				onExport={exportEvents}
				onNew={() => router.push('events/new')}
				loading={isLoading}
				error={error}
				activeMenu={activeMenu}
				onActiveMenuChange={setActiveMenu}
				onSearch={setSearch}
				onChangeSort={(sort) => {
					const generatedParameters = sort.map((s) => `${s.id} ${s.ascendant ? 'asc' : 'desc'}`).join(',');
					console.log(generatedParameters);
				}}
			/>
			{hasNextPage && <ShowMoreButton onClick={() => fetchNextPage()} loading={isFetchingNextPage} />}
		</>
	);
}
