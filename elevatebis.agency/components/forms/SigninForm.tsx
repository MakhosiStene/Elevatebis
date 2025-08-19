'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaEnvelope } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { LoginCredentials } from "@/utilities/types/schemas"
import Link from "next/link";

const SigninForm = () =>
{
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ formData, setFormData] = useState<LoginCredentials>({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleChange = ( e: React.ChangeEvent< HTMLInputElement >) =>
    {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({...prev, [name]: type === "checkbox" ? checked: value }));
    };

    const handleSubmit = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        setLoading( true );
        setError( null );
        try
        {
            const res = await fetch("/api/auth/signin", { 
                method: "POST" ,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    rememberMe: formData.rememberMe,
                }),
            })
            if (!res.ok)
            {
                const data = await res.json();
                throw new Error(data.error || "signing in was not successful");
            }
            router.push("/dashboard-app");
        } catch(err: any)
        {
            setError(err.message);
        } finally
        {
            setLoading( false )
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
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                        placeholder="••••••••"
                        required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                            <FaEye className="absolute right-3 top-3 w-5 h-5 text-gray-400 cursor-pointer" />
                        </button>
                </div>
            </div>

            <div className="flex justify-between">

                <div className="flex items-center mb-4">
                    <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="mr-2"
                    />
                    <label htmlFor="rememberMe" className="text-sm">
                    Remember me
                    </label>
                </div>

                <Link className="text-sky-500" href={"/auth-app/forgotten-password/"}>forgot password</Link>
                
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-600 focus:ring-opacity-50 transition-colors"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="mt-6 text-center text-gray-600">
                Don't have an account?<Link href="/signup" className="ml-1 text-red-600 hover:text-red-700 font-semibold focus:outline-none">Register</Link>
            </p>

        </form>
    )
}

export default SigninForm;