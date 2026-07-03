'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import { FAB } from '@/components/globals/FAB/FAB';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { ListSectionTitle } from '@/components/globals/ListSectionTitle/ListSectionTitle';

function Page() {
	return (
		<NavigationBarHeader title={'Développeurs'}>
			<section className={styles.section}>
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
			</FAB>
		</NavigationBarHeader>
	);
}

export default Page;
