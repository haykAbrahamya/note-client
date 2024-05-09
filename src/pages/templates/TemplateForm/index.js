import React, { useMemo, useRef, useState } from 'react';

import './styles.scss';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import { REQUIRED_ERROR_MESSAGE } from 'constants/messages';
import { ReactComponent as UploadIcon } from 'images/upload.svg';

const initialValues = {
	name: '',
};

export const TemplateForm = ({
	onClose,
	editableData,
	handleSubmit,
}) => {
	const [file, setFile] = useState(null);
	const filePath = useMemo(
		() =>
			file ? URL.createObjectURL(file) : editableData?.path,
		[file, editableData?.path]
	);
	const uploaderRef = useRef(null);
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
			handleSubmit({ ...formData, file });
	};

	const handleUploadChange = e => {
		if (e.target.files[0]) setFile(e.target.files[0]);
	};

	return (
		<div className='modal-form-wrapper' onClick={onClose}>
			<div
				className='form-container'
				onClick={e => e.stopPropagation()}
			>
				<div className='form-header'>
					{formType} Ձևանմուշ
				</div>
				<Input
					placeholder='Անվանում'
					value={formData.name}
					errorMessage={errors.name}
					name='name'
					onChange={handleFieldChange}
				/>
				{filePath ? (
					<img
						src={
							file
								? filePath
								: `http://${process.env.REACT_APP_API_URL}/files/${filePath}`
						}
						onClick={() => uploaderRef.current?.click()}
						alt='info'
					/>
				) : (
					<div
						className='upload-image-container'
						onClick={() => uploaderRef.current?.click()}
					>
						<UploadIcon />
					</div>
				)}

				<input
					type='file'
					className='uploader-input'
					onChange={handleUploadChange}
					ref={uploaderRef}
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
