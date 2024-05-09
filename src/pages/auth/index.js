import React from 'react';

import './styles.scss';
import { AuthForm } from './components/authForm';
import AuthPageBackground from '../../images/auth-page-background.png';

export const AuthPage = () => {
	return (
		<div className='auth-page-container'>
			<div className='image-container'>
				<img
					src={AuthPageBackground}
					alt='auth-background'
				/>
			</div>
			<AuthForm />
		</div>
	);
};
