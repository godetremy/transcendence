import { Calendar } from '@/components/globals/Calendar/Calendar';
import styles from './page.module.scss';
import { EventPreview } from '@/components/globals/EventPreview/EventPreview';

export default function Page() {
	return (
		<>
			<div className={styles.page}>
				<p>Hello, World !</p>
				<Calendar date={1} />
				<EventPreview
					image={'/images/demo_event_01.png'}
					date={12}
					title={'coucou'}
					time={'Lundi de 12h a 15h'}
					location={'Terrasse'}
				/>
			</div>
		</>
	);
}
