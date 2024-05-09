import React, { useContext, useEffect } from 'react';
import {
	Routes as CoreRoutes,
	Route,
} from 'react-router-dom';

import { AuthPage } from '../pages/auth';
import { AuthContext } from 'store/auth';
import {
	Navigate,
	useNavigate,
} from 'react-router-dom/dist';
import { OrdersPage } from 'pages/orders';
import { RegisterPage } from 'pages/register';

export const Routes = () => {
	const [token] = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!token && !localStorage.getItem('authToken'))
			navigate('/auth');
	}, [token]);

	return (
		<CoreRoutes>
			{!token && (
				<>
					<Route path='/auth' element={<AuthPage />} />
					<Route
						path='/register'
						element={<RegisterPage />}
					/>
				</>
			)}

			<Route
				index
				path='/orders'
				element={<OrdersPage />}
			/>
			<Route path='*' element={<Navigate to='/orders' />} />
		</CoreRoutes>
	);
};
