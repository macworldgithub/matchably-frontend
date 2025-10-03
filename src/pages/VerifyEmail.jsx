/** @format */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../config';

export default function VerifyEmail() {
	const location = useLocation();
	const navigate = useNavigate();
	const [status, setStatus] = useState('Verifying...');

	useEffect(() => {
		const verify = async () => {
			const token = new URLSearchParams(location.search).get('token');

			if (!token) {
				setStatus('Invalid verification link');
				return;
			}

			try {
				const res = await fetch(`${config.BACKEND_URL}/api/auth/verify-email`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token }),
				});

				const data = await res.json();
				if (data.status === 'success') {
					setStatus('Email verified successfully! Redirecting...');
					toast.success(data.message, { theme: 'dark' });
					setTimeout(() => navigate('/signin'), 2000);
				} else {
					setStatus(data.message || 'Verification failed.');
				}
			} catch (err) {
				setStatus('Something went wrong during verification.');
			}
		};

		verify();
	}, [location, navigate]);

	return (
		<div className='flex justify-center items-center min-h-screen bg-black text-white text-xl'>
			{status}
		</div>
	);
}
