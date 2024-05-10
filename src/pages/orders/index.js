import React, { useEffect, useRef, useState } from 'react';

import './styles.scss';
import { Layout } from 'components/layout';
import HttpService from 'services/http';
import { ReactComponent as EditIcon } from 'images/edit.svg';
import { Button } from 'ui/Button';
import { OrderForm } from './OrderForm';
import { toast } from 'react-toastify';
import { SUCCESS_MESSAGE } from 'constants/messages';
import { ReactComponent as DeleteIcon } from 'images/delete.svg';

const orderStatuses = {
	pending: 'Ընթացքի մեջ է',
	accepted: 'Հաստատված է',
	rejected: 'Մերվժած է',
};

export const OrdersPage = () => {
	const [ordersList, setOrdersList] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const editableOrderIndex = useRef(null);
	const [viewModeOrderIndex, setViewModeOrderIndex] =
		useState(false);

	const loadOrdersList = async () => {
		try {
			const res = await HttpService.get('/order');
			setOrdersList(res.orders);
		} catch (ex) {}
	};

	useEffect(() => {
		loadOrdersList();
	}, []);

	const handleCreateOrderclick = () => setIsFormOpen(true);

	const onCloseForm = () => {
		setIsFormOpen(false);
		setViewModeOrderIndex();
		editableOrderIndex.current = null;
	};

	const createOrder = async data => {
		try {
			const res = await HttpService.post('/order', data);
			if (res.isSuccess) {
				toast.success('Պատվերը ստեղծվեց');
				onCloseForm();
				loadOrdersList();
			}
		} catch (ex) {}
	};

	const formatViewModeOrder = order => {
		return {
			...order,
			cover: {
				templateId: order.cover.templateId._id,
				id: order.cover.id._id,
			},
			templates: order.templates.map(template => ({
				...template,
				paperId: template.paperId._id,
				templateId: template.templateId._id,
			})),
		};
	};

	return (
		<Layout>
			{isFormOpen && (
				<OrderForm
					onClose={onCloseForm}
					viewMode={viewModeOrderIndex}
					editableData={
						viewModeOrderIndex &&
						formatViewModeOrder(
							ordersList[viewModeOrderIndex]
						)
					}
					handleSubmit={createOrder}
				/>
			)}
			<div className='page-container'>
				<div className='page-header'>
					<Button onClick={handleCreateOrderclick}>
						Ավելացնել
					</Button>
				</div>
				<div className='page-inner-wrapper'>
					<div className='papers-list'>
						{ordersList.map((order, ind) => (
							<div
								key={order._id}
								className='paper-card'
								onClick={() => {
									setViewModeOrderIndex(ind);
									setIsFormOpen(true);
								}}
							>
								<div
									className={`card-header ${order.status}`}
								>
									{orderStatuses[order.status]}
								</div>
								<div className='info-row'>
									<span>Գին</span>
									<span>{order.price}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};
