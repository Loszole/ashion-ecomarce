
import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const history = useHistory();
	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		return () => { mountedRef.current = false; };
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Login failed");
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));
			const role = (data.user && data.user.role) || "user";
			if (["admin", "superadmin", "editor"].includes(role)) {
				history.push("/admin");
			} else {
				history.push("/");
			}
		} catch (err) {
			if (mountedRef.current) setError(err.message);
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	};

	return (
		<main className="container my-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow-sm">
						<div className="card-body">
							<h2 className="mb-4 text-center">Login to Your Account</h2>
							<form onSubmit={handleSubmit}>
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
								{error && <div className="alert alert-danger py-2">{error}</div>}
								<button type="submit" className="btn btn-primary w-100" disabled={loading}>
									{loading ? "Logging in..." : "Login"}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Login;
