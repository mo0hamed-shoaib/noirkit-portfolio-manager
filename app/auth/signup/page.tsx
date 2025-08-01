"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, name)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, color: 'bg-gray-600', label: '' }
    if (password.length < 6) return { strength: 25, color: 'bg-red-500', label: 'Weak' }
    if (password.length < 8) return { strength: 50, color: 'bg-yellow-500', label: 'Fair' }
    if (password.length < 12) return { strength: 75, color: 'bg-blue-500', label: 'Good' }
    return { strength: 100, color: 'bg-green-500', label: 'Strong' }
  }

  const passwordStrength = getPasswordStrength(password)

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          {/* Brand Header */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <img src="/icon.png" alt="NoirKit logo" width="32" height="32" className="rounded" />
            <span className="text-2xl font-mono font-bold tracking-wide">NoirKit</span>
          </div>

          <div className="border border-green-500/30 rounded-lg p-8 mb-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-mono text-green-400 mb-4">Check your email!</h2>
            <p className="text-gray-300 mb-6">
              We've sent you a confirmation link. Please check your email and click the link to activate your account.
            </p>
            
            <Link 
              href="/auth/login" 
              className="inline-block bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-6 py-3 rounded"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src="/icon.png" alt="NoirKit logo" width="32" height="32" className="rounded" />
            <span className="text-2xl font-mono font-bold tracking-wide">NoirKit</span>
          </div>
          <h1 className="text-3xl font-mono mb-2">Create Account</h1>
          <p className="text-gray-400">Sign up to create your portfolio dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
            <CustomInput
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="bg-gray-900 border-white/20 text-white placeholder:text-gray-500 focus:border-white/60 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <CustomInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-900 border-white/20 text-white placeholder:text-gray-500 focus:border-white/60 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <CustomInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-900 border-white/20 text-white placeholder:text-gray-500 focus:border-white/60 transition-all duration-300 pr-12"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-400 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Simple Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-800 rounded-full h-1 mr-3">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                  {passwordStrength.label && (
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength >= 75 ? 'text-green-400' : 
                      passwordStrength.strength >= 50 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
            <div className="relative">
              <CustomInput
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`bg-gray-900 border-white/20 text-white placeholder:text-gray-500 focus:border-white/60 transition-all duration-300 pr-12 ${
                  confirmPassword && password !== confirmPassword ? 'border-red-500/50' : ''
                }`}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-400 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-400 text-sm">Passwords do not match</p>
            )}
          </div>

          <CustomButton 
            type="submit" 
            className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300" 
            disabled={loading || (password && confirmPassword && password !== confirmPassword)}
          >
            {loading ? "Creating account..." : "Create Account"}
          </CustomButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white hover:underline transition-all duration-300">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}