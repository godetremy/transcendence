'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useUser } from '@/contexts/UserContext';
import { Pencil } from 'lucide-react';

function Page() {
	const user = useUser();
	return (
		<>
			<NavigationBarHeader title={'Mon compte'}>
				<section className={styles.section}>
					<div className={styles.list}>
						<ListItem
							title={'Nom'}
							rightElement={
								<div className={styles.penItem}>
									<span>{user?.last_name}</span>
									<Pencil size={16} color={'#F2F2F2'} opacity={0.6} />
								</div>
							}
							showChevron={false}
						/>
						<ListItem
							title={'Prénom'}
							rightElement={
								<div className={styles.penItem}>
									<span>{user?.first_name}</span>
									<Pencil size={16} color={'#F2F2F2'} opacity={0.6} />
								</div>
							}
							showChevron={false}
						/>
						<ListItem
							title={'Adresse e-mail'}
							rightElement={
								<div className={styles.penItem}>
									<span>{user?.mail}</span>
									<Pencil size={16} color={'#F2F2F2'} opacity={0.6} />
								</div>
							}
							showChevron={false}
							last
						/>
					</div>
				</section>
			</NavigationBarHeader>
		</>
	);
}

export default Page;
