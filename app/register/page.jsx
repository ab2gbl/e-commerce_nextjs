import RegisterComp from "@/components/RegisterComp"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterComp />
        </div>
      </div>
    </div>
  )
}
