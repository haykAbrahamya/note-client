const { createContext, useState } = require('react');

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
	const [token, setToken] = useState(null);

	return (
		<AuthContext.Provider value={[token, setToken]}>
			{children}
		</AuthContext.Provider>
	);
};
