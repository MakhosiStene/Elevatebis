import Image from "next/image";
import logo from '@/public/logo.png';
import SigninForm from "@/components/forms/SigninForm";

export default function SignInPage()
{
    return (<div className="w-full h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-400 p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-[50%] mb-4">
                        <Image src={logo} alt="Logo"  className="w-96" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome Back!
                    </h2>
                </div>
                <SigninForm />
            </div>
        </div>
    </div>)
}