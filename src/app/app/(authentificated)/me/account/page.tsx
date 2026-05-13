'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useUser } from '@/contexts/UserContext';
import { Lock } from 'lucide-react';

function Page() {
	const user = useUser();
	return (
		<>
			<NavigationBarHeader title={'Mon compte'}>
				<section className={styles.section}>
					<div className={styles.list}>
						<ListItem title={'Nom'} rightElement={user?.last_name} />
						<ListItem title={'Prenom'} rightElement={user?.first_name} />
						<ListItem title={'Adresse mail'} rightElement={user?.mail} />
					</div>
				</section>
			</NavigationBarHeader>
		</>
	);
}

export default Page;
