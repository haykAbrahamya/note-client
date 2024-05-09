import React from 'react';

import './styles.scss';

export const Input = ({
	errorMessage,
	onChange,
	value,
	placeholder,
	...rest
}) => {
	const handleChange = e =>
		onChange(e.target.value, e.target.name);

	return (
		<div className='input-wrapper'>
			{value && (
				<div className='placeholder'>{placeholder}</div>
			)}
			<input
				{...rest}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
			/>
			{errorMessage && <span>{errorMessage}</span>}
		</div>
	);
};
