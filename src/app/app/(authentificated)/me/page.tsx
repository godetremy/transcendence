'use client';
import { useUser } from '@/contexts/UserContext';

export default function Page() {
	const user = useUser();

	return (
		<section className={'content'}>
			<p>{user?.full_name}</p>
		</section>
	);
}
