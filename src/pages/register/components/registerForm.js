import React, { useContext, useState } from 'react';

import './styles.scss';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import HttpService from 'services/http';
import { ReactComponent as Logo } from 'images/logo.svg';
import { REQUIRED_ERROR_MESSAGE } from 'constants/messages';
import { AuthContext } from 'store/auth';

export const RegisterForm = () => {
	const [, setToken] = useContext(AuthContext);

	const [errors, setErrors] = useState({
		name: undefined,
		hvhh: undefined,
		email: undefined,
		password: undefined,
	});

	const [form, setForm] = useState({
		name: '',
		hvhh: '',
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
					'/user/sign-up',
					form
				);

				if (res.isSuccess) {
					const authRes = await HttpService.post(
						'/user/sign-in',
						form
					);

					if (authRes.isSuccess) {
						setToken(authRes.data.token);
						localStorage.setItem(
							'authToken',
							authRes.data.token
						);
					}
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
					name='name'
					placeholder='Անուն'
					value={form.name}
					errorMessage={errors.name}
					onChange={handleFieldChange}
				/>
				<Input
					name='hvhh'
					placeholder='ՀՎՀՀ'
					value={form.hvhh}
					errorMessage={errors.hvhh}
					onChange={handleFieldChange}
				/>
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
			</div>
		</div>
	);
};
