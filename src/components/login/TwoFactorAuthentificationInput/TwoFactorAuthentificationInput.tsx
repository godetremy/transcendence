import styles from './component.module.scss';
import { useEffect, useRef, useState } from 'react';

const CODE_SIZE = 6;

export function TwoFactorAuthentificationInput({
	submit,
	disable,
}: {
	submit: (code: string) => void;
	disable?: boolean;
}) {
	const [code, setCode] = useState('');
	const [focused, setFocused] = useState(Array(CODE_SIZE).fill(false));

	const inputRef = useRef<HTMLInputElement | null>(null);

	const selectionHandler = () => {
		const focused = Array(CODE_SIZE).fill(false);

		if ((inputRef.current?.selectionStart ?? 0) === (inputRef.current?.selectionEnd ?? 0)) {
			focused[Math.min(inputRef.current?.selectionStart ?? 0, CODE_SIZE - 1)] = true;
		} else {
			for (let i = inputRef.current?.selectionStart ?? 0; i < (inputRef.current?.selectionEnd ?? 0); i++) {
				focused[Math.min(i, CODE_SIZE - 1)] = true;
			}
		}

		setFocused(focused);
	};

	const updateCode = (content: string) => {
		const code = content.replaceAll(/\D+/g, '');
		setCode(code);
		if (code.length >= CODE_SIZE) submit(code);
	};

	useEffect(() => {
		if (disable === false) {
			inputRef.current?.focus();
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCode('');
			const focused = Array(CODE_SIZE).fill(false);
			focused[0] = true;
			setFocused(focused);
		}
	}, [disable]);

	return (
		<div className={styles.container}>
			<label htmlFor={'2FA'} className={styles.label}>
				Code de vérification
			</label>
			<div className={styles.two_factor_authentification_container}>
				{Array(CODE_SIZE)
					.fill(0)
					.map((_, i) => (
						<span
							key={i}
							className={`${styles.input} ${focused[i] ? styles.focus : ''}`}
							style={{
								color: `rgba(var(--color-rgb-primary-white), ${disable ? 0.4 : code.length <= i ? 0.4 : 1})`,
							}}
						>
							{code.length <= i ? '0' : code[i]}
						</span>
					))}
				<input
					name={'2FA'}
					ref={inputRef}
					maxLength={CODE_SIZE}
					value={code}
					inputMode={'numeric'}
					onChange={(e) => updateCode(e.target.value)}
					onBlur={() => setFocused(Array(CODE_SIZE).fill(false))}
					onSelect={selectionHandler}
					disabled={disable ?? false}
					autoComplete="one-time-code"
				/>
			</div>
		</div>
	);
}
