"use client"
import { useState } from "react"
import withRole from "@/utils/withRole"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://e-commerce-django-hsld.onrender.com"

function NewAdmin() {
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/users/admin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.status === 201) {
        setSuccess("Admin created successfully!")
        setForm({ username: "", email: "", password: "" })
      } else if (data.username && data.username[0]?.includes("already exists")) {
        setError("Username already exists.")
      } else if (data.email && data.email[0]?.includes("already exists")) {
        setError("Email already exists.")
      } else if (data.password) {
        setError("Password: " + data.password.join(", "))
      } else if (data.detail) {
        setError(data.detail)
      } else {
        setError("Failed to create admin. Please check the info.")
      }
    } catch (err) {
      setError("Failed to create admin. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/seller">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <UserPlus className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Admin</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new administrator account</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admin Account Details</CardTitle>
              <CardDescription>Fill in the information for the new admin user</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    disabled={isLoading}
                    placeholder="Enter username"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    disabled={isLoading}
                    placeholder="Enter email address"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    disabled={isLoading}
                    placeholder="Enter password"
                    className="h-10"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isLoading} className="w-full h-10">
                  {isLoading ? (
                    "Creating Admin..."
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Admin Account
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default withRole(NewAdmin, "ADMIN")
