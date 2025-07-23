"use client"
import { useEffect } from "react"
import { initAuth } from "@/utils/auth"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Smartphone } from "lucide-react"

const HomeComp1 = () => {
  const role = useSelector((state) => state.user.role)
  const isLog = useSelector((state) => state.user.isLog)
  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      if (!isLog) {
        const isAuthenticated = await initAuth()
        if (!isAuthenticated) {
          router.push("/login")
        }
      } else {
        if (role === "ADMIN") router.push("/seller")
        else if (role === "CLIENT") router.push("/client")
        else router.push("/login")
      }
    }

    initialize()
  }, [role, isLog, router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="text-center p-8">
        <CardContent>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading PhoneStore</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we set up your experience...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomeComp1
