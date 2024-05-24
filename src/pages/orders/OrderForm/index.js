import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import './styles.scss';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import { REQUIRED_ERROR_MESSAGE } from 'constants/messages';
import HttpService from 'services/http';
import { Select } from 'ui/Select';

const initialValues = {
	cover: {
		id: '',
		templateId: '',
	},
	dimensions: {
		width: '',
		height: '',
	},
	templates: [
		{
			id: uuid(),
			paperId: '',
			pageCount: '',
			templateId: '',
			colorsCount: '', // 2 || 4
		},
	],
	orderCount: 1,
	price: '', // calculate here and send to the api
};

const colorPrices = {
	2: 30,
	4: 40,
};

/*

size - milimeters

bloknoti layn, erk
layn - 12
erk - 25


tuxt - {
	erkarutyun - 1500
	laynutyun - 1000 (1) fixed
	gin - 240
}


price for one tuxt - (240 / (1500 / 12) * 1000 / 25 ) + ((nshvac guyneri gin(hardcode back model) * 12 * 25) / 1000^2)
1 bloknot = ((price for one tuxt  * ejeri qanak)  + kazmi modeli gin) * 1.20
sum = 1 bloknot
	txti gin * 


	apply this logic to all templates

*/

export const OrderForm = ({
	onClose,
	viewMode,
	editableData,
	handleSubmit,
}) => {
	const [formData, setFormData] = useState(
		editableData || initialValues
	);
	const [errors, setErrors] = useState({});
	const [lists, setLists] = useState({
		papers: [],
		templates: [],
		covers: [],
	});

	const price = useMemo(() => {
		let templatesPrice = 0;
		try {
			const cover = lists.covers.find(
				item => item._id === formData.cover.id
			);

			formData.templates.forEach(template => {
				const paper = lists.papers.find(
					item => item._id === template.paperId
				);
				templatesPrice +=
					paper.price * template.pageCount +
					template.pageCount *
						colorPrices[template.colorsCount];
				// templatesPrice +=
				// 	(paper.price /
				// 		((paper.width / formData.dimensions.height) *
				// 			((paper.height * 1000) /
				// 				formData.dimensions.width)) +
				// 		((colorPrices[template.colorsCount] *
				// 			formData.dimensions.height *
				// 			formData.dimensions.width) /
				// 			1000) *
				// 			1000) *
				// 	template.pageCount;
			});

			const finalPrice = (
				(templatesPrice + cover.price) *
				formData.orderCount *
				1.2
			).toFixed(0);
			return isNaN(finalPrice) ? 0 : finalPrice;
		} catch (ex) {
			return 0;
		}
	}, [formData]);

	const formType = `Ավելացնել`;

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

	const onSubmit = () => {
		handleSubmit({ ...formData, price });
	};

	const changePageTemplate = (
		templateId,
		templateUpdated
	) => {
		setFormData({
			...formData,
			templates: formData.templates.map(item => {
				if (item.id !== templateId) return item;

				return templateUpdated;
			}),
		});
	};

	const coversFormatted = lists.covers.map(item => ({
		value: item._id,
		label: `${item.type} (${item.price}֏)`,
	}));

	const templatesFormatted = lists.templates.map(item => ({
		value: item._id,
		label: item.name,
	}));

	const papersFormatted = lists.papers.map(item => ({
		value: item._id,
		label: `${item.type} (${item.width}x${
			item.height * 1000
		}, ${item.price}֏)`,
	}));

	return (
		<div className='modal-form-wrapper' onClick={onClose}>
			<div
				className='form-container'
				onClick={e => e.stopPropagation()}
			>
				<div className='form-header'>{formType} պատվեր</div>
				<div className='form-content'>
					<div className='form-part'>
						<span>Բլոկնոտ</span>
						<div className='form-part-fields'>
							<Input
								type='number'
								value={formData.orderCount}
								placeholder='Քանակ'
								onChange={val =>
									setFormData({
										...formData,
										orderCount: val,
									})
								}
							/>
						</div>
					</div>
					<div className='form-part'>
						<span>Կազմի նկարագրություն</span>
						<div className='form-part-fields'>
							<Select
								disabled={viewMode}
								placeholder='Կազմ'
								value={formData.cover?.id}
								options={coversFormatted}
								onChange={data =>
									setFormData({
										...formData,
										cover: {
											...formData.cover,
											id: data.value,
										},
									})
								}
							/>
							<Select
								disabled={viewMode}
								placeholder='Կազմի շաբլոն'
								options={templatesFormatted}
								value={formData.cover?.templateId}
								onChange={data =>
									setFormData({
										...formData,
										cover: {
											...formData.cover,
											templateId: data.value,
										},
									})
								}
							/>
							<Input
								disabled={viewMode}
								placeholder='Կազմի երկարություն'
								value={formData.dimensions.width}
								onChange={val =>
									setFormData({
										...formData,
										dimensions: {
											...formData.dimensions,
											width: val,
										},
									})
								}
							/>
							<Input
								disabled={viewMode}
								placeholder='Կազմի լայնություն'
								value={formData.dimensions.height}
								onChange={val =>
									setFormData({
										...formData,
										dimensions: {
											...formData.dimensions,
											height: val,
										},
									})
								}
							/>
						</div>
					</div>
					<div className='form-part'>
						<span>Էջերի ձևանմուշներ</span>
						<div className='form-part-fields templates'>
							{formData.templates.map(pagesTemplate => {
								return (
									<div
										key={pagesTemplate.id}
										className='pages-template-container'
									>
										<div className='fields-list-wrapper'>
											<Select
												disabled={viewMode}
												placeholder='Էջի տեսակ'
												options={papersFormatted}
												value={pagesTemplate.paperId}
												onChange={data =>
													changePageTemplate(
														pagesTemplate.id,
														{
															...pagesTemplate,
															paperId: data.value,
														}
													)
												}
											/>
											<Select
												disabled={viewMode}
												placeholder='Էջի շաբլոն'
												options={templatesFormatted}
												value={pagesTemplate.templateId}
												onChange={data =>
													changePageTemplate(
														pagesTemplate.id,
														{
															...pagesTemplate,
															templateId: data.value,
														}
													)
												}
											/>
											<Input
												disabled={viewMode}
												placeholder='Էջերի քանակ'
												value={pagesTemplate.pageCount}
												onChange={val =>
													changePageTemplate(
														pagesTemplate.id,
														{
															...pagesTemplate,
															pageCount: val,
														}
													)
												}
											/>
											<Select
												disabled={viewMode}
												placeholder='Գույների քանակ'
												value={pagesTemplate.colorsCount}
												options={[
													{ label: 2, value: 2 },
													{ label: 4, value: 4 },
												]}
												onChange={data =>
													changePageTemplate(
														pagesTemplate.id,
														{
															...pagesTemplate,
															colorsCount: data.value,
														}
													)
												}
											/>
										</div>
										{
											lists.templates.find(
												item =>
													item._id ===
													pagesTemplate.templateId
											)?.path && (
												<img
													src={`${
														process.env.REACT_APP_API_URL
													}/files/${
														lists.templates.find(
															item =>
																item._id ===
																pagesTemplate.templateId
														)?.path
													}`}
												/>
											) // bad, but fast
										}
									</div>
								);
							})}
						</div>
						{!viewMode && (
							<Button
								onClick={() =>
									setFormData({
										...formData,
										templates: formData.templates.concat({
											id: uuid(),
											paperId: '',
											pageCount: '',
											templateId: '',
											colorsCount: '', // 2 || 4
										}),
									})
								}
							>
								Ավելացնել ձևանմուշ
							</Button>
						)}
					</div>
				</div>
				<div className='actions-container'>
					<Button
						onClick={onClose}
						className={viewMode ? '' : 'outline'}
					>
						Փակել
					</Button>
					{!viewMode && (
						<Button onClick={onSubmit}>{`Պատվիրել ${
							`${price}֏` || ''
						}`}</Button>
					)}
				</div>
			</div>
		</div>
	);
};
