import { ConnectButton } from "@suiet/wallet-kit";

interface ConnectWalletProps {
  className?: string 
}
import "@suiet/wallet-kit/style.css";

export const ConnectWallet: React.FC<ConnectWalletProps> = ({className}) => {
  return (
    <div className="flex items-center justify-center">
      <ConnectButton className={`${className}`} >
        Connect Wallet
      </ConnectButton>
    </div>
  );
};

export default ConnectWallet;
