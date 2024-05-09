import React from 'react';
import cx from 'classnames';

import './styles.scss';

export const Switcher = ({ checked, onChange }) => {
	return (
		<div
			onClick={onChange}
			className={cx('switcher-container', {
				active: checked,
			})}
		>
			<div className='circle' />
		</div>
	);
};
