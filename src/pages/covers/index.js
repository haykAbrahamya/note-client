import React, { useEffect, useRef, useState } from 'react';

import './styles.scss';
import { Layout } from 'components/layout';
import HttpService from 'services/http';
import { ReactComponent as EditIcon } from 'images/edit.svg';
import { Button } from 'ui/Button';
import { CoverForm } from './CoverForm';
import { toast } from 'react-toastify';
import { SUCCESS_MESSAGE } from 'constants/messages';
import { Switcher } from 'ui/Switcher';

export const CoversPage = () => {
	const [coversList, setCoversList] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const editableCoverIndex = useRef(null);

	const loadCoversList = async () => {
		try {
			const res = await HttpService.get('/cover');
			setCoversList(res.covers);
		} catch (ex) {}
	};

	useEffect(() => {
		loadCoversList();
	}, []);

	const handleUpdateCoverClick = ind => {
		editableCoverIndex.current = ind;
		setIsFormOpen(true);
	};

	const handleCreateCoverClick = () => setIsFormOpen(true);

	const onCloseForm = () => {
		setIsFormOpen(false);
		editableCoverIndex.current = null;
	};

	const addCover = async data => {
		try {
			const res = await HttpService.post('/cover', data);

			if (res.isSuccess) {
				loadCoversList();
				onCloseForm();
				toast.success(SUCCESS_MESSAGE);
			}
		} catch (ex) {}
	};

	const updateCover = async data => {
		try {
			const res = await HttpService.put(
				`/cover/${data._id}`,
				data
			);

			if (res.isSuccess) {
				setCoversList(
					coversList.map(cover => {
						if (cover._id === data._id) return data;

						return cover;
					})
				);

				onCloseForm();
				toast.success(SUCCESS_MESSAGE);
			}
		} catch (ex) {}
	};

	const toggleCoverStatus = async cover => {
		try {
			const res = await HttpService.post(
				`/cover/${cover._id}/${
					cover.isDeactivated ? 'activate' : 'deactivate'
				}`
			);

			if (res.isSuccess) {
				setCoversList(
					coversList.map(item => {
						if (cover._id !== item._id) return item;

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
				<CoverForm
					onClose={onCloseForm}
					editableData={
						coversList[editableCoverIndex.current]
					}
					handleSubmit={
						editableCoverIndex.current !== null
							? updateCover
							: addCover
					}
				/>
			)}
			<div className='page-container'>
				<div className='page-header'>
					<Button onClick={handleCreateCoverClick}>
						Ավելացնել
					</Button>
				</div>
				<div className='page-inner-wrapper'>
					<div className='papers-list'>
						{coversList.map((cover, ind) => (
							<div key={cover._id} className='paper-card'>
								<div className='card-header'>
									<EditIcon
										color='#cdcf48'
										onClick={() =>
											handleUpdateCoverClick(ind)
										}
									/>
									<Switcher
										checked={!cover.isDeactivated}
										onChange={() =>
											toggleCoverStatus(cover)
										}
									/>
								</div>
								<div className='info-row'>
									<span>Տիպ</span>
									<span>{cover.type}</span>
								</div>
								<div className='info-row'>
									<span>Գին</span>
									<span>{cover.price}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};
