import React from 'react';
import ReactSelect from 'react-select';

import './styles.scss';

export const Select = ({
	options,
	placeholder,
	onChange,
	disabled,
	value,
	...rest
}) => {
	return (
		<div className='select-container'>
			{value && (
				<div className='placeholder'>{placeholder}</div>
			)}
			<ReactSelect
				options={options}
				isDisabled={disabled}
				placeholder={placeholder}
				value={options.find(item => item.value === value)}
				onChange={onChange}
				styles={{
					control: (baseStyles, state) => ({
						...baseStyles,
						textAlign: 'start',
						minHeight: '48px',
						borderRadius: '8px',
					}),
					menu: (baseStyles, state) => ({
						...baseStyles,
						padding: '5px',
						zIndex: 3,
					}),
					option: (baseStyles, state) => ({
						...baseStyles,
						color: state.isFocused ? '#fff' : '#000',
						borderRadius: state.isFocused ? '10px' : '0px',
						backgroundColor: state.isFocused
							? '#9181f4'
							: '#fff',
						padding: '5px',
					}),
				}}
				{...rest}
			/>
		</div>
	);
};
