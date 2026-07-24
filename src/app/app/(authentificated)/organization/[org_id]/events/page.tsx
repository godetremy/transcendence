'use client';
import styles from './page.module.scss';
import OrganizationDashboardTable from '@/components/organization/OrganizationDashboardTable/OrganizationDashboardTable';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { createEventMutate, deleteEventMutate, exportEventMutate, getEvents, importEventMutate } from '@/lib/fetcher/events';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { MenuButton } from '@/components/globals/MenuButton/MenuButton';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { CreateOrUpdateEventType, PrivateEvent } from '@/types/Event';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import Image from 'next/image';
import { CircleLoader } from '@/components/globals/CircleLoader/CircleLoader';
import { ImportCard, ImportCardTargetField } from '@/components/globals/ImportCard/ImportCard';
import { ExportCard } from '@/components/globals/ExportCard/ExportCard';
import { FilterType } from '@/components/globals/FilterButton/FilterButton';

function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export default function Page() {
	const router = useRouter();
	const orgctx = useOrganizations();
	const modal = useModal();
	const organization = orgctx.getCurrentOrganization()!;

	const [activeMenu, setActiveMenu] = useState<number>(0);
	const [search, setSearch] = useState<string>('');
	const [generatedParameters, setGeneratedParameters] = useState<string | null>(null);
	const [generatedParametersFilter, setGeneratedParametersFilter] = useState<string | null>(null);
	const [showImportCard, setShowImportCard] = useState<boolean>(false);
	const [showExportCard, setShowExportCard] = useState<boolean>(false);

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery(
		getEvents(
			organization.id,
			generatedParameters,
			activeMenu == 2 ? null : new Date().toISOString(),
			activeMenu == 0 ? null : activeMenu == 2 ? new Date().toISOString() : addDays(new Date(), 7).toISOString(),
			search,
			activeMenu,
			generatedParametersFilter
		)
	);

	const deleteEventMutation = useMutation(deleteEventMutate(organization.id));
	const exportEventMutation = useMutation(exportEventMutate(organization.id));
	const createEventMutation = useMutation(createEventMutate(organization.id));
	//const importEventMutation = useMutation(importEventMutate(organization.id));

	const importTargetFields: ImportCardTargetField[] = [
		{ id: 'tilte', text: 'Nom de l’événement', required: true },
		{ id: 'subtitle', text: 'Sous-titrage'},
		{ id: 'description', text: 'Description'},
		{ id: 'start_at', text: 'Commence le', required: true },
		{ id: 'end_at', text: 'Fini le', required: true },
		{ id: 'max_registration', text: 'Maximun d\'inscrit' },
		{ id: 'location', text: 'Localisation' },
	];

	const exportEvents = useCallback(
		async (format: string) => {
			const response = await exportEventMutation.mutateAsync({ type: format, filename: 'events' });
			try {
				if (!response.ok) throw 'Invalid file';
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `events.${format}`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);
				setShowExportCard(false);
			} catch (error) {
				console.error("Erreur lors de l'export:", error);
			}
		},
		[organization.id, generatedParameters]
	);

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
					<Calendar key={0} date={event.start_at} size={'small'} />,
					<p key={2} className={styles.title}>
						{event.title}
					</p>,
					<span key={3} className={styles.detail}>
						{new Date(event.created_at).toLocaleDateString('fr-FR', { dateStyle: 'short' })}
					</span>,
					<div key={4} className={styles.group}>
						<Image
							src={event.owner.profile_picture}
							alt={`Photo de ${event.owner.full_name}`}
							width={20}
							height={20}
							className={styles.avatar}
						/>
						<span className={styles.detail}>{event.owner.full_name}</span>
					</div>,
					<div key={5} className={styles.group}>
						<CircleLoader
							progress={event.event_registration.length / (event.max_registration ?? 1)}
							size={20}
							strokeWidth={10}
						/>
						<span className={styles.detail}>
							{event.event_registration.length}/
							{event.max_registration == null ? '∞' : event.max_registration}
						</span>
					</div>,
					<MenuButton
						key={index}
						containerKey={`${page_index}_${index}`}
						alignRight={true}
						menu={[
							{
								title: 'Modifier',
								icon: Pencil,
								onClick: () => {
									router.push(`events/${event.id}/edit`);
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
			<OrganizationDashboardTable
				header={{
					title: `Events`,
					menu: [{ text: 'À venir' }, { text: 'Dans les 7 prochains jours' }, { text: 'Passée' }],
				}}
				column={[
					{ id: 'date', text: 'Date', width: 70 },
					{ id: 'name', text: 'Nom de l’événement' },
					{ id: 'created_at', text: 'Crée le', width: 100 },
					{ id: 'created_by', text: 'Crée par', width: 200 },
					{ id: 'register', text: 'Inscrits', width: 100, sortable: false },
					{ text: '', width: 50, sortable: false },
				]}
				filters={[
					{
						id: 'start_at',
						title: 'Commence à',
						type: FilterType.STRING,
					},
					{
						id: 'end_at',
						title: 'Termine à',
						type: FilterType.STRING,
					},
					{
						id: 'name',
						title: "Nom de l'éléments",
						type: FilterType.STRING,
					},
					{
						id: 'created_at',
						title: 'Crée le',
						type: FilterType.STRING,
					},
					{
						id: 'created_by',
						title: 'Crée par',
						type: FilterType.STRING,
					},
				]}
				data={listEvents}
				onImport={() => setShowImportCard(true)}
				onExport={() => setShowExportCard(true)}
				onNew={() => router.push('events/new')}
				loading={isLoading || isFetchingNextPage}
				error={error}
				activeMenu={activeMenu}
				onActiveMenuChange={setActiveMenu}
				onSearch={setSearch}
				onChangeSort={(sort) => {
					setGeneratedParameters(sort.map((s) => `${s.id} ${s.ascendant ? 'asc' : 'desc'}`).join(','));
				}}
				onChangeFilter={(filter) => {
					setGeneratedParametersFilter(
						filter.map((f) => `${f.id} ${f.comparaison} ${f.value}`).join(',') || null
					);
				}}
				hasNextPage={hasNextPage}
				onLoadNextPage={fetchNextPage}
			/>
			<ImportCard
				visible={showImportCard}
				requestClose={() => setShowImportCard(false)}
				columns={importTargetFields}
				onImport={(row: Record<string, string>) => {
					console.log(row);
					const fields: CreateOrUpdateEventType = {
						title: row.title,
						subtitle: row.subtitle ?? '',
						description: row.description ?? '',
						max_registration: Number(row.max_registration) ?? null,
						location: row.location ?? null,
						image: '/path/to/image',
						start_at: new Date(row.start_at),
						end_at: new Date(row.end_at)
					}
					createEventMutation.mutate({event: fields});
					if (row['title'].includes('Axel')) throw new Error('Contenu problématique.');
					return new Promise((resolve) => {
						setTimeout(resolve, 1000);
					});
				}}
				loading={createEventMutation.isPending}
			/>
			<ExportCard
				visible={showExportCard}
				requestClose={() => setShowExportCard(false)}
				onExport={exportEvents}
				loading={exportEventMutation.isPending}
			/>
		</>
	);
}
