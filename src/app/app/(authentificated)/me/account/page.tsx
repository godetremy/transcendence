'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import ModificationText from '@/components/globals/ModificationText/ModificationText';
import { useUser } from '@/contexts/UserContext';

function Page() {
	const user = useUser();
	return (
		<NavigationBarHeader title={'Mon compte'}>
			<section className={styles.section}>
				<span className={styles.listSectionTitle}>Informations personnelles</span>

				<div className={styles.list}>
					<ListItem
						title={'Nom'}
						rightElement={<ModificationText value={user?.last_name || ''} />}
						showChevron={false}
					/>
					<ListItem
						title={'Prénom'}
						rightElement={<ModificationText value={user?.first_name || ''} />}
						showChevron={false}
					/>
					<ListItem
						title={'Adresse e-mail'}
						rightElement={<ModificationText value={user?.mail || ''} />}
						showChevron={false}
						last
					/>
				</div>
			</section>
		</NavigationBarHeader>
	);
}

export default Page;
