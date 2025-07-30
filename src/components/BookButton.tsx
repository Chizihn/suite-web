import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import ConnectWallet from "./ConnectWallet";

// Create a portal target element for the fixed button
const createFixedButtonContainer = (): HTMLDivElement => {
  let el = document.getElementById('fixed-button-container') as HTMLDivElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = 'fixed-button-container';
    document.body.appendChild(el);
  }
  return el;
};

interface BookButtonProps {
  isConnected: boolean;
  onBook: () => void;
}

const BookButton: React.FC<BookButtonProps> = ({ isConnected, onBook }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create or get the fixed container
    let fixedContainer = document.getElementById('fixed-button-container') as HTMLDivElement;
    if (!fixedContainer) {
      fixedContainer = createFixedButtonContainer();
    }
    setContainer(fixedContainer);

    // Cleanup function
    return () => {
      if (fixedContainer && fixedContainer.childNodes.length === 0) {
        document.body.removeChild(fixedContainer);
      }
    };
  }, []);

  const handleBook = () => {
    if (!isConnected) {
      setShowModal(true);
      return;
    }
    onBook();
  };

  if (!container) return null;

  const buttonContent = (
    <div
      className="md:hidden w-full"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        // right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #374151',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '0.8rem  1rem',
      }}
    >
      <div className="flex items-center justify-between ">
        <div>
          <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Starting from
          </p>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              120
            </span>
            <span className="text-lg ml-2" style={{ color: "var(--text-secondary)" }}>
              $SUI
            </span>
            <span className="text-sm ml-1" style={{ color: "var(--text-tertiary)" }}>
              / night
            </span>
          </div>
        </div>
        <div>
          <Button
            onClick={handleBook}
            className="w-full font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Reserve Now
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(buttonContent, container)}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="md:hidden"
      >
       <div className="p-3 ">
{
  isConnected ? <div>
    <h3 className="text-2xl font-semibold mb-3 text-gray-900  text-center" style={{color: "var(--text-primary)"}}>Wallet Connected Successfully</h3>

  </div> 
  :
  <>
    <h3 className="text-2xl font-semibold mb-3 text-gray-900  text-center" style={{color: "var(--text-primary)"}}>Connect Wallet</h3>
  <p className="text-gray-600 mb-6 text-text-secondary text-center" style={{color: "var(--text-secondary)"}}>
    Connect your wallet to book hotels and access exclusive features.
  </p>
  </>
}
  <ConnectWallet className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200" />
</div>

      </Modal>
    </>
  );
};

export default BookButton;