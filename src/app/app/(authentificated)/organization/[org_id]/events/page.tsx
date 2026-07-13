'use client';
import { OrganizationDashboardTable } from '@/components/organization/OrganizationDashboardTable/OrganizationDashboardTable';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import {
	deleteEventMutate,
	exportEventMutate,
	getEvents,
	importEventMutate,
	updateEventMutate,
} from '@/lib/fetcher/events';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
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
	const [generatedParameters, setGeneratedParameters] = useState<string | null>(null);

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery(
		getEvents(
			organization.id,
			generatedParameters,
			activeMenu == 2 ? null : new Date().toISOString(),
			activeMenu == 0 ? null : activeMenu == 2 ? new Date().toISOString() : addDays(new Date(), 7).toISOString(),
			search,
			activeMenu
		)
	);

	const deleteEventMutation = useMutation(deleteEventMutate(organization.id));
	const exportEventMutation = useMutation(exportEventMutate(organization.id));
	const importEventMutation = useMutation(importEventMutate(organization.id));
	const updateEventMutation = useMutation(updateEventMutate(organization.id));

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

			importEventMutation.mutate({ body: formData });
			e.target.value = '';
		},
		[organization.id]
	);

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const exportEvents = useCallback(async () => {
		const response = await exportEventMutation.mutateAsync({ type: 'xlsx', filename: 'events' });
		try {
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
	}, [organization.id, generatedParameters]);

	const formatDate = (date: string) => {
		const d = new Date(date);
		return `${d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`;
	};

	const deleteEventModal = async (event: PrivateEvent<object>) => {
		modal.openModal({
			title: `Veux-tu vraiment supprimer « ${event.title} » ?`,
			message: 'Attention, une fois supprimer tu ne pourras pas le récupérer.',
			buttons: [
				{ text: 'Je le laisse' },
				{
					negative: true,
					text: 'Supprimer cette événement',
					onClick: () => {
						deleteEventMutation.mutate({ event });
					},
				},
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
								onClick: () => {
									//updateEventMutation.mutate(event, event.id);
								},
							},
							{
								title: 'Supprimer',
								icon: Trash2,
								negative: true,
								onClick: async () => deleteEventModal(event),
							},
						]}
					/>,
				],
			}))
		);
	}, [data, deleteEventModal]);

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
				loading={isLoading || isFetchingNextPage}
				error={error}
				activeMenu={activeMenu}
				onActiveMenuChange={setActiveMenu}
				onSearch={setSearch}
				onChangeSort={(sort) => {
					setGeneratedParameters(sort.map((s) => `${s.id} ${s.ascendant ? 'asc' : 'desc'}`).join(','));
					console.log(generatedParameters);
				}}
				hasNextPage={hasNextPage}
				onLoadNextPage={fetchNextPage}
			/>
		</>
	);
}
