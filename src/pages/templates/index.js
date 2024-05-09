import React, { useEffect, useRef, useState } from 'react';

import './styles.scss';
import { Layout } from 'components/layout';
import HttpService from 'services/http';
import { ReactComponent as EditIcon } from 'images/edit.svg';
import { Button } from 'ui/Button';
import { TemplateForm } from './TemplateForm';
import { toast } from 'react-toastify';
import { SUCCESS_MESSAGE } from 'constants/messages';
import { Switcher } from 'ui/Switcher';

export const TemplatesPage = () => {
	const [templatesList, setTemplatesList] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const editableTemplateIndex = useRef(null);

	const loadTemplatesList = async () => {
		try {
			const res = await HttpService.get('/template');

			setTemplatesList(res.templates);
		} catch (ex) {}
	};

	useEffect(() => {
		loadTemplatesList();
	}, []);

	const handleUpdateTemplateClick = ind => {
		editableTemplateIndex.current = ind;
		setIsFormOpen(true);
	};

	const handleCreateTemplateClick = () =>
		setIsFormOpen(true);

	const onCloseForm = () => {
		setIsFormOpen(false);
		editableTemplateIndex.current = null;
	};

	const uploadImage = async file => {
		try {
			const formData = new FormData();
			formData.append('file', file, file.name);

			const res = await HttpService.post(
				'/upload',
				formData,
				true
			);

			return res.data.filename;
		} catch (ex) {}
	};

	const addTemplate = async data => {
		try {
			const imagePath = await uploadImage(data.file);

			const res = await HttpService.post('/template', {
				name: data.name,
				path: imagePath,
			});

			if (res.isSuccess) {
				loadTemplatesList();
				onCloseForm();
				toast.success(SUCCESS_MESSAGE);
			}
		} catch (ex) {}
	};

	const updateTemplate = async data => {
		try {
			let imagePath = data.path;

			if (data.file) {
				imagePath = await uploadImage(data.file);
			}
			const res = await HttpService.put(
				`/template/${data._id}`,
				{ name: data.name, path: imagePath }
			);

			if (res.isSuccess) {
				setTemplatesList(
					templatesList.map(template => {
						if (template._id === data._id)
							return { name: data.name, path: imagePath };

						return template;
					})
				);

				onCloseForm();
				toast.success(SUCCESS_MESSAGE);
			}
		} catch (ex) {}
	};

	const toggleTemplateStatus = async template => {
		try {
			const res = await HttpService.post(
				`/template/${template._id}/${
					template.isDeactivated ? 'activate' : 'deactivate'
				}`
			);

			if (res.isSuccess) {
				setTemplatesList(
					templatesList.map(item => {
						if (template._id !== item._id) return item;

						return {
							...item,
							isDeactivated: !item.isDeactivated,
						};
					})
				);
			}
		} catch (ex) {}
	};

	return (
		<Layout>
			{isFormOpen && (
				<TemplateForm
					onClose={onCloseForm}
					editableData={
						templatesList[editableTemplateIndex.current]
					}
					handleSubmit={
						editableTemplateIndex.current !== null
							? updateTemplate
							: addTemplate
					}
				/>
			)}
			<div className='page-container'>
				<div className='page-header'>
					<Button onClick={handleCreateTemplateClick}>
						Ավելացնել
					</Button>
				</div>
				<div className='page-inner-wrapper'>
					<div className='papers-list'>
						{templatesList.map((template, ind) => (
							<div
								key={template._id}
								className='paper-card'
							>
								<div className='card-header'>
									<EditIcon
										color='#cdcf48'
										onClick={() =>
											handleUpdateTemplateClick(ind)
										}
									/>
									<Switcher
										checked={!template.isDeactivated}
										onChange={() =>
											toggleTemplateStatus(template)
										}
									/>
								</div>
								<div className='info-row'>
									<span>Անվանում</span>
									<span>{template.name}</span>
								</div>
								{template.path && (
									<div className='info-row'>
										<img
											alt='info'
											src={`${process.env.REACT_APP_API_URL}/files/${template.path}`}
										/>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};
