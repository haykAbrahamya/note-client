import React from 'react';
import ReactSelect from 'react-select';

import './styles.scss';

export const Select = ({
	options,
	placeholder,
	onChange,
}) => {
	return (
		<div className='select-container'>
			<ReactSelect
				options={options}
				placeholder={placeholder}
				onChange={data => console.log(data)}
				styles={{
					control: (baseStyles, state) => ({
						...baseStyles,
						textAlign: 'start',
					}),
					menu: (baseStyles, state) => ({
						...baseStyles,
						padding: '5px',
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
			/>
		</div>
	);
};
