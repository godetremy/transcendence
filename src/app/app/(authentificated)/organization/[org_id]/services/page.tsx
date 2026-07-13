'use client';
import { OrganizationDashboardTable } from '@/components/organization/OrganizationDashboardTable/OrganizationDashboardTable';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { MenuButton } from '@/components/globals/MenuButton/MenuButton';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import {
	deleteServiceMutate,
	exportServiceMutate,
	getServices,
	importServiceMutate,
	updateServiceMutate,
} from '@/lib/fetcher/services';
import { PrivateService } from '@/types/Service';

export default function Page() {
	const router = useRouter();
	const orgctx = useOrganizations();
	const modal = useModal();
	const organization = orgctx.getCurrentOrganization()!;

	const [activeMenu, setActiveMenu] = useState<number>(0);
	const [search, setSearch] = useState<string>('');
	const [generatedParameters, setGeneratedParameters] = useState<string | null>(null);

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery(
		getServices(
			organization.id,
			generatedParameters,
			activeMenu == 2 ? null : new Date().toISOString(),
			activeMenu == 0 ? null : activeMenu == 2 ? new Date().toISOString() : addDays(new Date(), 7).toISOString(),
			search,
			activeMenu
		)
	);

	const deleteServiceMutation = useMutation(deleteServiceMutate(organization.id));
	const exportServiceMutation = useMutation(exportServiceMutate(organization.id));
	const importServiceMutation = useMutation(importServiceMutate(organization.id));
	const updateServiceMutation = useMutation(updateServiceMutate(organization.id));

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

			importServiceMutation.mutate({ body: formData });
			e.target.value = '';
		},
		[organization.id]
	);

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const exportServices = useCallback(async () => {
		const response = await exportServiceMutation.mutateAsync({ type: 'xlsx', filename: 'events' });
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

	const deleteServiceModal = async (service: PrivateService<object>) => {
		modal.openModal({
			title: `Veux-tu vraiment supprimer « ${service.title} » ?`,
			message: 'Attention, une fois supprimer tu ne pourras pas le récupérer.',
			buttons: [
				{ text: 'Je le laisse' },
				{
					negative: true,
					text: 'Supprimer cette événement',
					onClick: () => {
						deleteServiceMutation.mutate({ service });
					},
				},
			],
		});
	};

	const listEvents = useMemo(() => {
		if (!data) return [];

		return data.pages.flatMap((page, page_index) =>
			page.data.map((service, index) => ({
				key: `${page_index}_${index}`,
				children: [
					<p key={1}>{formatDate(service.start_at!)}</p>,
					<p key={2}>{service.title!}</p>,
					<p key={3}>{formatDate(service.created_at)}</p>,
					<p key={4}>{service.location}</p>,
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
								onClick: async () => deleteServiceModal(service),
							},
						]}
					/>,
				],
			}))
		);
	}, [data, deleteServiceModal]);

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
					title: `Services`,
					menu: [{ text: 'Tous' }, { text: 'En cours' }, { text: 'Expirée' }],
				}}
				column={[
					{ id: 'date', text: 'Date', width: 70 },
					{ id: 'name', text: 'Nom du service' },
					{ id: 'created_at', text: 'Crée le', width: 80 },
					{ id: 'created_by', text: 'Crée par', width: 200 },
					{ text: '', width: 50, sortable: false },
				]}
				data={listEvents}
				onImport={openFilePicker}
				onExport={exportServices}
				onNew={() => router.push('services/new')}
				loading={isLoading || isFetchingNextPage}
				error={error}
				activeMenu={activeMenu}
				onActiveMenuChange={setActiveMenu}
				onSearch={setSearch}
				onChangeSort={(sort) => {
					setGeneratedParameters(sort.map((s) => `${s.id} ${s.ascendant ? 'asc' : 'desc'}`).join(','));
				}}
				hasNextPage={hasNextPage}
				onLoadNextPage={fetchNextPage}
			/>
		</>
	);
}
