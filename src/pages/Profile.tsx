import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wallet,  
  LogOut, 
  User, 
  ChevronRight, 
  Copy, 
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle,
  Calendar,
  History,
  ShieldCheck
} from "lucide-react";
import { useWallet } from "../contexts/WalletContext";
import { Button } from "../components/ui/Button";
import ConnectWallet from "../components/ConnectWallet";

const Profile: React.FC = () => {
  const { address, isConnected, disconnect, getBalance } = useWallet();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<string>("0");
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'history'>('bookings');
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected) {
        setIsLoadingBalance(true);
        try {
          const balance = await getBalance();
          setBalance(balance || "0");
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance("0");
        } finally {
          setIsLoadingBalance(false);
        }
      } else {
        setBalance("0");
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [isConnected, getBalance]);

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://suiscan.xyz/address/${address}`, "_blank");
    }
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  if (!isConnected) {
    return (
      <div className="min-h-[70vh] bg-background-primary flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 rounded-xl border text-center" style={{ 
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-primary)'
        }}>
          <div className="w-20 h-20 rounded-full bg-surface-secondary flex items-center justify-center mb-6 mx-auto">
            <Wallet size={32} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Connect Your Wallet
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Connect your Sui wallet to view your profile, bookings, and manage your account.
          </p>
          <ConnectWallet className="w-full py-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
      {/* Header */}
      {/* <header className="my-8">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">Profile</h1>
          <p className="text-lg text-text-secondary">Manage your account.</p>
        </header> */}

      <div className=" py-4 pb-24">
        {/* Profile Card */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Card */}
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--surface-primary)', 
              borderColor: 'var(--border-primary)' 
            }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2" style={{ borderColor: 'var(--primary)' }}>
                  <User size={32} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Wallet Profile</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    </span>
                    <button onClick={copyAddress} className="p-1" title={copied ? "Copied!" : "Copy address"}>
                      {copied ? <CheckCircle size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} style={{ color: 'var(--text-tertiary)' }} />}
                    </button>
                    <button onClick={viewOnExplorer} className="p-1" title="View on Explorer">
                      <ExternalLink size={14} style={{ color: 'var(--text-tertiary)' }} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" style={{ 
                  backgroundColor: 'var(--surface-secondary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Balance</span>
                    <button 
                      onClick={toggleBalanceVisibility}
                      className="p-1 rounded-full"
                      style={{ backgroundColor: 'var(--surface-primary)' }}
                    >
                      {showBalance ? <EyeOff size={16} style={{ color: 'var(--text-tertiary)' }} /> : <Eye size={16} style={{ color: 'var(--text-tertiary)' }} />}
                    </button>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {isLoadingBalance ? (
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {showBalance ? balance : '•••••'}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>SUI</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-lg border" style={{ 
                  backgroundColor: 'var(--surface-secondary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={16} style={{ color: 'var(--primary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Wallet Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span style={{ color: 'var(--text-primary)' }}>Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeTab === 'bookings' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Calendar size={16} />
                  My Bookings
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <History size={16} />
                  History
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'bookings' ? (
                <div className="rounded-xl p-6 shadow-sm border" style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Upcoming Stays</h3>
                  <div className="text-center py-8">
                    <Calendar size={40} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                    <h4 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No upcoming stays</h4>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      You don't have any upcoming bookings yet. Start exploring now!
                    </p>
                    <Button
                      onClick={() => navigate('/hotels')}
                      className="bg-primary text-white py-3 px-6 font-medium "
                    >
                      Book a Stay
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-6 shadow-sm border" style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Booking History</h3>
                  <div className="text-center py-8">
                    <History size={40} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                    <h4 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No booking history</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Your past stays will appear here after your first booking.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl p-6 shadow-sm border" style={{ 
                backgroundColor: 'var(--surface-primary)', 
                borderColor: 'var(--border-primary)' 
              }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Account Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full py-3 flex items-center justify-between"
                    onClick={() => navigate('/security-tips')}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
                      <span>Security Tips</span>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-3 flex items-center justify-between"
                    onClick={viewOnExplorer}
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink size={16} style={{ color: 'var(--text-tertiary)' }} />
                      <span>View on Sui Explorer</span>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full py-3 flex items-center justify-between"
                    onClick={handleDisconnect}
                  >
                    <div className="flex items-center gap-2">
                      <LogOut size={16} style={{ color: 'var(--error)' }} />
                      <span>Disconnect Wallet</span>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;