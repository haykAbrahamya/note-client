import React from 'react';
import cx from 'classnames';

import './styles.scss';

export const Button = ({
	children,
	className = '',
	...rest
}) => {
	return (
		<div
			className={cx('button-wrapper', {
				[className]: true,
			})}
			{...rest}
		>
			{children}
		</div>
	);
};
