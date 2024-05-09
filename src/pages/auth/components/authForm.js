import React, { useContext, useState } from 'react';

import './styles.scss';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import HttpService from 'services/http';
import { ReactComponent as Logo } from 'images/logo.svg';
import { REQUIRED_ERROR_MESSAGE } from 'constants/messages';
import { AuthContext } from 'store/auth';
import { useNavigate } from 'react-router-dom';

export const AuthForm = () => {
	const [, setToken] = useContext(AuthContext);
	const navigate = useNavigate();

	const [errors, setErrors] = useState({
		email: undefined,
		password: undefined,
	});

	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const validateField = value => {
		if (!value) return REQUIRED_ERROR_MESSAGE;
	};

	const handleLogin = async () => {
		const newErrors = {};

		for (const key in form) {
			const errorMessage = validateField(form[key]);

			if (errorMessage) newErrors[key] = errorMessage;
		}

		if (!Object.keys(newErrors).length) {
			try {
				const res = await HttpService.post(
					'/user/sign-in',
					form
				);

				if (res.isSuccess) {
					setToken(res.data.token);
					localStorage.setItem('authToken', res.data.token);
				}
			} catch (ex) {}
		} else setErrors(newErrors);
	};

	const handleFieldChange = (value, fieldName) => {
		const errorMessage = validateField(value);

		setForm({ ...form, [fieldName]: value });

		if (errorMessage !== errors[fieldName])
			setErrors({
				...errors,
				[fieldName]: errorMessage,
			});
	};

	return (
		<div className='auth-form-container'>
			<Logo />
			<span className='sub-title'>Հրաշք վեբսայթ</span>
			<div className='form-wrapper'>
				<Input
					name='email'
					placeholder='Էլ․ հասցե'
					value={form.email}
					errorMessage={errors.email}
					onChange={handleFieldChange}
				/>
				<Input
					name='password'
					type='password'
					placeholder='Գաղտնաբառ'
					value={form.password}
					onChange={handleFieldChange}
					errorMessage={errors.password}
				/>
				<Button onClick={handleLogin}>Մուտք</Button>
				<div className='regsiter-label'>
					Դեռ գրացնված չեք?{' '}
					<span onClick={() => navigate('/register')}>
						Գրանցվել
					</span>
				</div>
			</div>
		</div>
	);
};
