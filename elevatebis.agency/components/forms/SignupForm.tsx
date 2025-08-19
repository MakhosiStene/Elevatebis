'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaEnvelope } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { RegisterData } from "@/utilities/types/schemas"
import Link from "next/link";

const SignupForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<RegisterData>({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validatePassword = (password: string, email: string): void => {
        // Extract domain from email
        const domain = email.split('@')[1] || '';
        
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            throw new Error("Password must contain at least one special character.");
        }

        if (!/\d/.test(password)) {
            throw new Error("Password must contain at least one number.");
        }

        if (domain && password.toLowerCase().includes(domain.toLowerCase())) {
            throw new Error("Password must not contain part of your email domain.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Validate passwords match
            if (formData.password !== password2) {
                throw new Error("Passwords do not match");
            }

            // Validate password strength
            validatePassword(formData.password, formData.email);

            const res = await fetch("/api/auth/signup", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Signing in was not successful");
            }
            
            router.push("/dashboard-app");
        } catch(err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return(
        <form onSubmit={handleSubmit} className="w-full">
            {error && (
                <p className="text-red-500 text-center text-sm mb-3">
                    {error}
                </p>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                        placeholder="you@example.com"
                        required
                    />
                    <FaEnvelope className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                        placeholder="enter password"
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Repeat Password</label>
                <div className="relative">
                    <input
                        id="password2"
                        name="password2"
                        type={showPassword2 ? "text" : "password"}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                        placeholder="confirm password"
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword2(!showPassword2)}
                    >
                        {showPassword2 ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-600 focus:ring-opacity-50 transition-colors"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="mt-6 text-center text-gray-600">
                Don't have an account?<Link href="/auth-app/signup" className="ml-1 text-red-600 hover:text-red-700 font-semibold focus:outline-none">Register</Link>
            </p>
        </form>
    )
}

export default SignupForm;