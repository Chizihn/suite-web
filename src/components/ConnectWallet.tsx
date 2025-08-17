import { ConnectButton } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";

interface ConnectWalletProps {
  className?: string 
}
import "@suiet/wallet-kit/style.css";

export const ConnectWallet: React.FC<ConnectWalletProps> = ({className}) => {
  return (
    <div className="flex items-center justify-center">
       <ConnectButton 
              connectText="Connect Wallet"
              className={`w-full bg-primary text-white rounded-md py-3 ${className}`}
            />
    </div>
  );
};

export default ConnectWallet;
