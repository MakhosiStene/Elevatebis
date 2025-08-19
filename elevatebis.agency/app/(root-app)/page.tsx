import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-[100vh]">
      <h1>Welcome to Elevatebis</h1>
      <p>Your one-stop solution for all your business needs.</p>
      
      <Link href="/signin" className="text-blue-500 hover:underline">
        Sign In
      </Link>
    </div>
  )
}
