import { Calendar } from '@/components/globals/Calendar/Calendar';

export default function Page() {
	return (
		<>
			<p>Hello, World !</p>
			<Calendar date={new Date().getTime()} />
			<br />
			<Calendar date={new Date('2024-12-25').getTime()} />
			<br />
			<Calendar date={new Date('2024-01-01').getTime()} />
		</>
	);
}
