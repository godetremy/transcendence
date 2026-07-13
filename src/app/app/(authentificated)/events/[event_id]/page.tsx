'use client';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import { Clock, MapPin } from 'lucide-react';

export default function Page() {
	const { event_id } = useParams();

	return (
		<div className={styles.main_container}>
			<header>
				<img src={'/images/demo_event_01.png'} alt={'Demo'} />
				<div>
					<Calendar date={new Date()} />
					<div>
						<h1>Titre de l&#39;évent</h1>
						<div>
							<button>
								<Clock />
								<span>Lundi de 18h à 20h</span>
							</button>
							<button>
								<MapPin />
								<span>Amphithéàtre</span>
							</button>
						</div>
					</div>
				</div>
			</header>
			<article>
				<section>
					<p>Description de taille par défaut</p>
					<button>S&#39;inscrire</button>
				</section>
			</article>
		</div>
	);
}
