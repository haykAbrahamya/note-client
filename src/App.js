import React, { useContext, useEffect } from 'react';
import { Routes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';
import { AuthContext } from 'store/auth';
import { BrowserRouter } from 'react-router-dom/dist';

function App() {
	const [, setToken] = useContext(AuthContext);

	useEffect(() => {
		const existingToken = localStorage.getItem('authToken');

		if (existingToken) setToken(existingToken);
	}, [setToken]);

	return (
		<>
			<ToastContainer />
			<div className='App'>
				<BrowserRouter>
					<Routes />
				</BrowserRouter>
			</div>
		</>
	);
}

export default App;
