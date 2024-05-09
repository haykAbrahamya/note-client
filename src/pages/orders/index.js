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

export const OrdersPage = () => {
	const [ordersList, setOrdersList] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const editableOrderIndex = useRef(null);

	const loadOrdersList = async () => {
		try {
			const res = await HttpService.get('/paper');
			setOrdersList(res.papers);
		} catch (ex) {}
	};

	useEffect(() => {
		loadOrdersList();
	}, []);

	const handleUpdateOrderClick = ind => {
		editableOrderIndex.current = ind;
		setIsFormOpen(true);
	};

	const handleCreateOrderclick = () => setIsFormOpen(true);

	const onCloseForm = () => {
		setIsFormOpen(false);
		editableOrderIndex.current = null;
	};

	const addOrder = async data => {
		try {
			const res = await HttpService.post('/order', data);

			if (res.isSuccess) {
				loadOrdersList();
				onCloseForm();
				toast.success(SUCCESS_MESSAGE);
			}
		} catch (ex) {}
	};

	const updateOrder = async data => {
		try {
			const res = await HttpService.put(
				`/order/${data._id}`,
				data
			);

			if (res.isSuccess) {
				setOrdersList(
					ordersList.map(order => {
						if (order._id === data._id) return data;

						return order;
					})
				);

				onCloseForm();
				toast.success(SUCCESS_MESSAGE);
			}
		} catch (ex) {}
	};

	const deleteOrder = async orderId => {
		try {
			const res = await HttpService.delete(
				`/order/${orderId}`
			);

			if (res.isSuccess) {
				setOrdersList(
					ordersList.filter(order => order._id !== orderId)
				);
			}
		} catch (ex) {}
	};

	return (
		<Layout>
			{isFormOpen && (
				<OrderForm
					onClose={onCloseForm}
					editableData={
						ordersList[editableOrderIndex.current]
					}
					handleSubmit={
						editableOrderIndex.current !== null
							? updateOrder
							: addOrder
					}
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
							<div key={order._id} className='paper-card'>
								<div className='card-header'>
									<EditIcon
										color='#cdcf48'
										onClick={() =>
											handleUpdateOrderClick(ind)
										}
									/>
									<DeleteIcon
										fill='red'
										onClick={() => deleteOrder(order._id)}
									/>
								</div>
								<div className='info-row'>
									<span>Չափս</span>
									<span>{order.type}</span>
								</div>
								<div className='info-row'>
									<span>Գին</span>
									<span>{order.price}</span>
								</div>
								<div className='info-row'>
									<span>Երկարություն</span>
									<span>{order.width}</span>
								</div>
								<div className='info-row'>
									<span>Լայնություն</span>
									<span>{order.height}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};
