import React from 'react';

import './styles.scss';
import { RegisterForm } from './components/registerForm';
import AuthPageBackground from '../../images/auth-page-background.png';

export const RegisterPage = () => {
	return (
		<div className='auth-page-container'>
			<div className='image-container'>
				<img
					src={AuthPageBackground}
					alt='auth-background'
				/>
			</div>
			<RegisterForm />
		</div>
	);
};
