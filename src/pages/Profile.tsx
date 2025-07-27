"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Settings, Wallet, Bell, HelpCircle, Mail, LogOut, User, ChevronRight, Copy, ExternalLink } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { useSuiWallet } from "../hooks/useSuiWallet"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

interface ProfileItemProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
  isDanger?: boolean
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, title, description, onClick, isDanger = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-4 text-left transition-all hover:bg-surface-secondary ${
      isDanger ? "hover:bg-error/10" : ""
    }`}
  >
    <div
      className={`p-2 rounded-lg mr-4 ${
        isDanger ? "bg-error/10 text-error" : "bg-surface-tertiary text-text-secondary"
      }`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className={`font-medium ${isDanger ? "text-error" : "text-text-primary"}`}>{title}</p>
      <p className="text-sm text-text-tertiary">{description}</p>
    </div>
    <ChevronRight size={16} className="text-text-tertiary flex-shrink-0" />
  </button>
)

const Profile: React.FC = () => {
  const { user, disconnect } = useAuthStore()
  const { address, isConnected } = useSuiWallet()
  const navigate = useNavigate()

  const handleDisconnect = () => {
    disconnect()
    navigate("/")
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://suiexplorer.com/address/${address}`, "_blank")
    }
  }

  // if (!isConnected) {
  //   return (
  //     <div className="container py-6">
  //       <div className="max-w-md mx-auto text-center space-y-6">
  //         <div className="w-24 h-24 bg-surface-secondary rounded-full flex items-center justify-center mx-auto">
  //           <Wallet size={32} className="text-text-tertiary" />
  //         </div>
  //         <div className="space-y-2">
  //           <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
  //           <p className="text-text-secondary">Connect your wallet to access your profile and manage your bookings.</p>
  //         </div>
  //         <Button onClick={() => navigate("/")} className="mx-auto">
  //           Connect Wallet
  //         </Button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="container py-6 space-y-8">
      {/* Profile Header */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto rounded-full bg-surface-secondary flex items-center justify-center">
          <User size={32} className="text-text-tertiary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="inline-flex items-center px-3 py-1.5 bg-surface-secondary rounded-full">
            <span className="text-sm font-mono text-text-secondary">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
            </span>
          </div>
        </div>
      </div>

      {/* Wallet Info */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-text-primary">Wallet Information</h3>
        <div className="space-y-3">
          <div className="p-3 bg-surface-secondary rounded-lg">
            <p className="text-xs text-text-tertiary mb-1">Wallet Address</p>
            <p className="font-mono text-sm text-text-primary break-all">{address}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={copyAddress} variant="secondary" size="small" className="flex items-center gap-2 flex-1">
              <Copy size={14} />
              Copy Address
            </Button>
            <Button onClick={viewOnExplorer} variant="secondary" size="small" className="flex items-center gap-2 flex-1">
              <ExternalLink size={14} />
              View Explorer
            </Button>
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Account Settings</h2>
        <Card className="divide-y divide-border-primary">
          <ProfileItem
            icon={<Bell size={18} />}
            title="Notifications"
            description="Manage your notification preferences"
            onClick={() => navigate("/settings")}
          />
          <ProfileItem
            icon={<Settings size={18} />}
            title="Settings"
            description="Customize your app preferences"
            onClick={() => navigate("/settings")}
          />
        </Card>
      </div>

      {/* Support */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Support</h2>
        <Card className="divide-y divide-border-primary">
          <ProfileItem
            icon={<HelpCircle size={18} />}
            title="Help Center"
            description="Get help with your bookings and account"
            onClick={() => navigate("/help")}
          />
          <ProfileItem
            icon={<Mail size={18} />}
            title="Contact Us"
            description="Reach out to our support team"
            onClick={() => navigate("/help")}
          />
        </Card>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Account</h2>
        <Card>
          <ProfileItem
            icon={<LogOut size={18} />}
            title="Disconnect Wallet"
            description="Sign out of your account"
            onClick={handleDisconnect}
            isDanger
          />
        </Card>
      </div>
    </div>
  )
}

export default Profile
