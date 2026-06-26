import { Carousel } from '@/components/carousel/Carousel/Carousel';
// import styles from '@/app/app/(authentificated)/me/privacy/page.module.scss';
import styles from './page.module.scss';
import SectionHeaderTitle from '@/components/globals/SectionHeaderTitle/SectionHeaderTitle';

export default function Page() {
	return (
		<>
			<div className={styles.carousel}>
				<Carousel
					slides={[
						{
							slideTitle: 'STUDENT PARTY',
							slideImage: '/images/demo_event_01.png',
							slideDescription: 'Rejoins tout les étudiants de Charente dans une soirée festive.',
							slideTag: {
								text: 'pour toi',
								color: 'purple',
							},
						},
						{
							slideTitle: 'SCCUC GAMES',
							slideImage: '/images/demo_event_02.png',
							slideDescription: 'Créer une équipe et participe au épreuves organisé par le SCUCC.',
							slideTag: {
								text: 'Bientot',
								color: 'pink',
							},
						},
						{
							slideTitle: 'BATTLE CAMPUS 1.6',
							slideImage: '/images/demo_event_03.png',
							slideDescription: "Présentes tes talents à un jury d'exception.",
							slideTag: {
								text: 'Bientot',
								color: 'pink',
							},
						},
						{
							slideTitle: 'Place de cine gratuite',
							slideImage: '/images/demo_event_04.png',
							slideDescription: 'Profite de places de cinéma gratuites au Cinéma de la Cité à Angoulême.',
							slideTag: {
								text: 'pour toi',
								color: 'purple',
							},
						},
					]}
				/>
			</div>
			<section className={styles.list}>
				<SectionHeaderTitle title={'Pour toi'} />
				<SectionHeaderTitle title={'Ajout recents'} />
				<SectionHeaderTitle title={'Bientot'} />
			</section>
		</>
	);
}
