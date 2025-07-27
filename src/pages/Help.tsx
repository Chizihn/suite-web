import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Key,
  HelpCircle,
  Mail,
  MessageCircle,
  Search,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

interface TopicCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full lg:w-[47%] bg-surface rounded-md p-4 text-center shadow-sm hover:bg-surface-hover transition-colors"
  >
    <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-3">
      {icon}
    </div>
    <p className="text-sm text-primary font-medium">{title}</p>
  </button>
);

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { disconnect } = useAuthStore();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDisconnect = () => {
    disconnect();
    navigate("/connect-wallet");
  };

  const handleTopicPress = (topic: string) => {
    console.log("Topic pressed:", topic);
  };

  const handleContactSupport = (method: string) => {
    console.log("Contact support:", method);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b border-border-primary bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-surface-hover"
            >
              <ArrowLeft size={20} className="text-primary" />
            </button>
            <h1 className="text-xl font-semibold text-primary">
              Help & Support
            </h1>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface rounded-lg py-3 pl-10 pr-4 text-sm text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary">
              <Search size={20} />
            </div>
          </div>
        </div>

        <div>
          <p className="text-lg font-medium text-primary mb-3">Popular Topics</p>
          <div className="flex flex-wrap gap-4">
            <TopicCard
              icon={<CreditCard size={24} className="text-primary" />}
              title="Payment Methods"
              onClick={() => handleTopicPress("Payment Methods")}
            />
            <TopicCard
              icon={<Key size={24} className="text-primary" />}
              title="Accessing Your Account"
              onClick={() => handleTopicPress("Accessing Your Account")}
            />
            <TopicCard
              icon={<HelpCircle size={24} className="text-primary" />}
              title="General FAQs"
              onClick={() => handleTopicPress("General FAQs")}
            />
          </div>
        </div>

        <div>
          <p className="text-h5 text-text-primary mb-3">Contact Support</p>
          <Card variant="default">
            <button
              onClick={() => handleContactSupport("email")}
              className="flex items-center py-3 border-b border-border-secondary"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-secondary flex items-center justify-center mr-3">
                <Mail size={20} className="text-primary" />
              </div>
              <p className="text-sm text-primary flex-1">Email Us</p>
              <div className="w-5 h-5 text-tertiary">›</div>
            </button>
            <button
              onClick={() => handleContactSupport("chat")}
              className="flex items-center py-3"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-secondary flex items-center justify-center mr-3">
                <MessageCircle size={20} className="text-primary" />
              </div>
              <p className="text-sm text-primary flex-1">
                Chat with Us
              </p>
              <div className="w-5 h-5 text-tertiary">›</div>
            </button>
          </Card>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleDisconnect}
            className="w-full bg-surface text-primary rounded-lg py-3 border border-border-primary hover:bg-surface-hover"
          >
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Help;
