import React, { useState } from 'react';

import './styles.scss';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import { REQUIRED_ERROR_MESSAGE } from 'constants/messages';

const initialValues = {
	type: '',
	price: '',
};

export const CoverForm = ({
	onClose,
	editableData,
	handleSubmit,
}) => {
	const formType = editableData ? 'Փոփոխել' : 'Ավելացնել';
	const [formData, setFormData] = useState(
		editableData || initialValues
	);
	const [errors, setErrors] = useState({});

	const validateField = value => {
		if (!value) return REQUIRED_ERROR_MESSAGE;
	};

	const handleFieldChange = (value, fieldName) => {
		const errorMessage = validateField(value);

		setFormData({ ...formData, [fieldName]: value });

		if (errorMessage !== errors[fieldName])
			setErrors({
				...errors,
				[fieldName]: errorMessage,
			});
	};

	const onSubmit = () => {
		const newErrors = {};

		for (const key in initialValues) {
			const errorMessage = validateField(formData[key]);

			if (errorMessage) newErrors[key] = errorMessage;
		}

		setErrors(newErrors);

		if (!Object.keys(newErrors).length)
			handleSubmit(formData);
	};

	return (
		<div className='modal-form-wrapper' onClick={onClose}>
			<div
				className='form-container'
				onClick={e => e.stopPropagation()}
			>
				<div className='form-header'>{formType} Կազմ</div>
				<Input
					placeholder='Չափս'
					value={formData.type}
					errorMessage={errors.type}
					name='type'
					onChange={handleFieldChange}
				/>
				<Input
					placeholder='Գին'
					errorMessage={errors.price}
					value={formData.price}
					name='price'
					onChange={handleFieldChange}
				/>
				<div className='actions-container'>
					<Button onClick={onClose} className='outline'>
						Փակել
					</Button>
					<Button onClick={onSubmit}>{formType}</Button>
				</div>
			</div>
		</div>
	);
};
