import React, { useContext, useMemo } from 'react';
import cx from 'classnames';

import { ReactComponent as Logo } from 'images/logo.svg';
import {
	useLocation,
	useNavigate,
} from 'react-router-dom/dist';
import { AuthContext } from 'store/auth';

export const Sidebar = () => {
	const [, setToken] = useContext(AuthContext);
	const location = useLocation();
	const navigate = useNavigate();

	const items = useMemo(() => {
		return [
			{
				id: 1,
				path: '/orders',
				title: 'Պատվերներ',
			},
		];
	}, []);

	const logout = () => {
		localStorage.removeItem('authToken');
		setToken(null);
		navigate('/auth');
	};

	return (
		<div className='sidebar-container'>
			<div className='logo-wrapper'>
				<Logo />
			</div>
			<div className='sidebar-content'>
				<div className='items-list'>
					{items.map(item => (
						<div
							key={item.path}
							className={cx('sidebar-item', {
								active: location.pathname === item.path,
							})}
							onClick={() => navigate(item.path)}
						>
							{item.title}
						</div>
					))}
				</div>
			</div>
			<div className='sidebar-footer'>
				<span onClick={logout}>Ելք</span>
			</div>
		</div>
	);
};
