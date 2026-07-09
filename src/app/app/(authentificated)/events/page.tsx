import styles from './page.module.scss';
import { EventPreview } from '@/components/globals/EventPreview/EventPreview';
import { Search } from 'lucide-react';

export default function Page() {
	return (
		<>
			<div className={styles.page}>
				<div className={styles.groupButton}>
					<div className={styles.scrollArea}>
						<button className={styles.first}>Tous</button>
						<button className={styles.button}>Inscrit</button>
						<button className={styles.button}>Par les clubs</button>
						<button className={styles.button}>Par les clubs</button>
					</div>
					<button className={styles.buttonSearch}>
						<Search size={16} />
					</button>
				</div>
				<h1 className={styles.h1}>AUJOURD'HUI</h1>
				<EventPreview
					image={'/images/demo_event_01.png'}
					date={Date.now()}
					title={'🎙️ Soirée Karaoké'}
					time={'Lundi de 12h a 15h'}
					location={'Terrasse'}
				/>
				<EventPreview
					image={'/images/demo_event_01.png'}
					date={Date.now()}
					title={'🎙️ Soirée Karaoké'}
					time={'Lundi de 12h a 15h'}
					location={'Terrasse'}
				/>
				<EventPreview
					image={'/images/demo_event_01.png'}
					date={Date.now()}
					title={'🎙️ Soirée Karaoké'}
					time={'Lundi de 12h a 15h'}
					location={'Terrasse'}
				/>
				<h1 className={styles.h1}>DEMAIN</h1>
				<EventPreview
					image={'/images/demo_event_01.png'}
					date={Date.now()}
					title={'🎙️ Soirée Karaoké'}
					time={'Lundi de 12h a 15h'}
					location={'Terrasse'}
				/>
				<EventPreview
					image={'/images/demo_event_01.png'}
					date={Date.now()}
					title={'🎙️ Soirée Karaoké'}
					time={'Lundi de 12h a 15h'}
					location={'Terrasse'}
				/>
			</div>
		</>
	);
}
