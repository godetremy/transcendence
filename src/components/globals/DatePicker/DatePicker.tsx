import styles from './component.module.scss';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale/fr';
import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';

type CustomInputProps = {
	className?: string;
	value?: string;
	onClick?: () => void;
};

const CustomInputPicker = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick, className }, ref) => (
	<button type="button" className={className} onClick={onClick} ref={ref}>
		{value}
		<ChevronDown size={22} />
	</button>
));
CustomInputPicker.displayName = 'CustomInputPicker';

export function InputDatePicker({ selected, onChange }: { selected: Date; onChange: (date: Date | null) => void }) {
	registerLocale('fr', fr);

	return (
		<DatePicker
			selected={selected}
			onChange={onChange}
			locale={'fr'}
			showTimeSelect
			closeOnScroll
			timeIntervals={15}
			timeFormat={'HH:mm'}
			dateFormat={'dd MMMM yyyy à HH:mm'}
			className={styles.datepicker}
			popperClassName={styles.popper}
			customInput={<CustomInputPicker />}
		/>
	);
}
