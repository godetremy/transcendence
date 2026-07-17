'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { WipState } from '@/components/globals/WipState/WipState';

function Page() {
	return (
		<NavigationBarHeader title={'Développeurs'}>
			{/*<section className={styles.section}>
				<ListSectionTitle>Mes applications</ListSectionTitle>

				<ListContainer>
					<ListItem
						leftElement={
							<Image
								src={'https://rusty.42angouleme.fr/assets/favicon-dxhbd3f4af6124aab8.ico'}
								alt={'Rusty app icon'}
								width={35}
								height={35}
								className={styles.app_icon}
							/>
						}
						title={'Rusty'}
						description={'Application de suivi pédagogique'}
						last={true}
					/>
				</ListContainer>
			</section>
			<FAB>
				<Plus />
			</FAB>*/}
			<WipState />
		</NavigationBarHeader>
	);
}

export default Page;
