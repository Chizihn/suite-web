"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown } from "lucide-react"
import { useSuiWallet } from "../hooks/useSuiWallet"

const WalletButton: React.FC = () => {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const { isConnected, address, walletName, disconnect, wallets } = useSuiWallet()

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setShowDropdown(false)
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setShowDropdown(false)
      // You could add a toast notification here
    }
  }

  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://suiexplorer.com/address/${address}`, "_blank")
      setShowDropdown(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)} className="btn btn-primary flex items-center gap-2">
          <Wallet size={16} />
          <span className="hidden sm:inline">Connect Wallet</span>
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 mt-2 w-72 bg-surface-primary rounded-xl shadow-xl border border-border-primary z-50 animate-fade-in">
              <div className="p-4 border-b border-border-primary">
                <h3 className="font-semibold text-text-primary mb-1">Connect Wallet</h3>
                <p className="text-sm text-text-secondary">Choose a wallet to connect to Sui.te</p>
              </div>
              <div className="p-2">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => {
                      // The actual connection is handled by the wallet's UI
                      setShowDropdown(false)
                      navigate("/profile")
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors"
                  >
                    {wallet.icon && (
                      <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="w-6 h-6 rounded" />
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-medium text-text-primary">{wallet.name}</p>
                      <p className="text-xs text-text-tertiary">
                        {wallet.name === "Sui Wallet" ? "Official Sui Wallet" : "Third-party wallet"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-surface-secondary hover:bg-surface-tertiary rounded-lg transition-colors border border-border-primary"
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Wallet size={14} className="text-primary" />
        </div>
        <span className="hidden sm:inline font-mono text-sm text-text-primary">
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
        <ChevronDown size={14} className="text-text-tertiary" />
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-surface-primary rounded-xl shadow-xl border border-border-primary z-50 animate-fade-in">
            <div className="p-4 border-b border-border-primary">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wallet size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Connected</p>
                  <p className="text-sm text-text-secondary">{walletName}</p>
                </div>
              </div>
              <div className="p-3 bg-surface-secondary rounded-lg">
                <p className="text-xs text-text-tertiary mb-1">Wallet Address</p>
                <p className="font-mono text-sm text-text-primary break-all">{address}</p>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                <Copy size={16} className="text-text-secondary" />
                <span className="text-text-primary">Copy Address</span>
              </button>

              <button
                onClick={viewOnExplorer}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                <ExternalLink size={16} className="text-text-secondary" />
                <span className="text-text-primary">View on Explorer</span>
              </button>

              <div className="divider my-2"></div>

              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors text-error"
              >
                <LogOut size={16} />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WalletButton
