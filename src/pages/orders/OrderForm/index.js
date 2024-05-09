import React, { useEffect, useState } from 'react';

import './styles.scss';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import { REQUIRED_ERROR_MESSAGE } from 'constants/messages';
import HttpService from 'services/http';
import { Select } from 'ui/Select';

const initialValues = {
	type: '',
	price: '',
	width: '',
};

export const OrderForm = ({
	onClose,
	editableData,
	handleSubmit,
}) => {
	const formType = editableData ? 'Փոփոխել' : 'Ավելացնել';
	const [formData, setFormData] = useState(
		editableData || initialValues
	);
	const [errors, setErrors] = useState({});
	const [lists, setLists] = useState({
		papers: [],
		templates: [],
		covers: [],
	});

	const loadPapers = async () => {
		try {
			const res = await HttpService.get('/paper');

			return res.papers.filter(item => !item.isDeactivated);
		} catch (ex) {}
	};

	const loadTemplates = async () => {
		try {
			const res = await HttpService.get('/template');

			return res.templates.filter(
				item => !item.isDeactivated
			);
		} catch (ex) {}
	};

	const loadCovers = async () => {
		try {
			const res = await HttpService.get('/cover');

			return res.covers.filter(item => !item.isDeactivated);
		} catch (ex) {}
	};

	const loadLists = async () => {
		const papers = (await loadPapers()) || [];
		const covers = (await loadCovers()) || [];
		const templates = (await loadTemplates()) || [];

		setLists({ papers, covers, templates });
	};

	useEffect(() => {
		loadLists();
	}, []);
	console.log(lists, 'lists');
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

	const coversFormatted = lists.covers.map(item => ({
		value: item._id,
		label: item.type,
	}));

	return (
		<div className='modal-form-wrapper' onClick={onClose}>
			<div
				className='form-container'
				onClick={e => e.stopPropagation()}
			>
				<div className='form-header'>{formType} պատվեր</div>
				<Select options={coversFormatted} />
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
				<Input
					placeholder='Երկարություն'
					value={formData.width}
					errorMessage={errors.width}
					name='width'
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
