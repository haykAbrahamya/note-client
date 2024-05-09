import React from 'react';

import './styles.scss';
import { Sidebar } from './sidebar';

export const Layout = ({ children }) => {
	return (
		<div className='layout-container'>
			<Sidebar />
			<div className='page-content'>{children}</div>
		</div>
	);
};
