

import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Registration failed");
			setSuccess(true);
			setTimeout(() => history.push("/login"), 1500);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="container my-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow-sm">
						<div className="card-body">
							<h2 className="mb-4 text-center">Create an Account</h2>
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="name" className="form-label">Full Name</label>
									<input
										type="text"
										className="form-control"
										id="name"
										placeholder="Enter your name"
										required
										value={name}
										onChange={e => setName(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">Email address</label>
									<input
										type="email"
										className="form-control"
										id="email"
										placeholder="Enter your email"
										required
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">Password</label>
									<input
										type="password"
										className="form-control"
										id="password"
										placeholder="Enter password"
										required
										value={password}
										onChange={e => setPassword(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
									<input
										type="password"
										className="form-control"
										id="confirmPassword"
										placeholder="Confirm password"
										required
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
									/>
								</div>
								{error && <div className="alert alert-danger py-2">{error}</div>}
								{success && <div className="alert alert-success py-2">Registration successful! Redirecting...</div>}
								<button type="submit" className="btn btn-primary w-100" disabled={loading}>
									{loading ? "Registering..." : "Register"}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Register;
