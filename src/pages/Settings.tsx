import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  DollarSign,
  Languages,
  Link,
  User,
  Shield,
  HelpCircle,
  FileText,
  Info,
} from "lucide-react";
import { Card } from "../components/ui/Card";

interface SettingItemProps {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  value?: string;
  onClick?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  value,
  onClick,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
}) => (
  <div
    className={`flex items-center py-3 border-b border-border-secondary last:border-b-0 ${
      showSwitch ? "" : "cursor-pointer"
    }`}
    onClick={!showSwitch ? onClick : undefined}
  >
    <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center mr-3">
      {React.cloneElement(icon, {
        className: "w-5 h-5 text-secondary"
      })}
    </div>
    <div className="flex-1">
      <p className="text-body1 text-text-primary font-medium">{title}</p>
      <p className="text-sm text-secondary">{description}</p>
    </div>
    {showSwitch ? (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={switchValue}
          onChange={(e) => onSwitchChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-10 h-5 rounded-full ${
            switchValue ? "bg-primary" : "bg-surface-secondary"
          }`}
        ></div>
        <div
          className={`absolute w-3 h-3 bg-text-inverse rounded-full transition-transform ${
            switchValue ? "translate-x-5" : "translate-x-1"
          } top-1`}
        ></div>
      </label>
    ) : value ? (
      <span className="text-body1 text-text-primary ml-2">{value}</span>
    ) : (
      <div className="w-5 h-5 text-text-tertiary">›</div>
    )}
  </div>
);

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // Centralized setting sections with their items
  const settingsSections = [
    {
      title: "App Preferences",
      items: [
        {
          icon: <Bell size={20} />,
          title: "Notifications",
          description:
            "Enable or disable push notifications for booking updates",
          showSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        {
          icon: <DollarSign size={20} />,
          title: "Currency Display",
          description: "Choose the currency in which prices are displayed",
          value: "USD",
          onClick: () => navigate("/profile/currency"),
        },
        {
          icon: <Languages size={20} />,
          title: "Language",
          description: "Select your preferred language for the app interface",
          value: "English",
          onClick: () => navigate("/profile/language"),
        },
      ],
    },
    {
      title: "Account Management",
      items: [
        {
          icon: <Link size={20} />,
          title: "Linked Accounts",
          description: "Manage your linked accounts for seamless transactions",
          onClick: () => navigate("/profile/linked-accounts"),
        },
        {
          icon: <User size={20} />,
          title: "Personal Information",
          description: "Update your personal information and contact details",
          onClick: () => navigate("/profile/edit"),
        },
        {
          icon: <Shield size={20} />,
          title: "Security",
          description:
            "Change your password or enable two-factor authentication",
          onClick: () => navigate("/profile/security"),
        },
      ],
    },
    {
      title: "Support & Information",
      items: [
        {
          icon: <HelpCircle size={20} />,
          title: "Help Center",
          description: "Access our help center for FAQs and support articles",
          onClick: () => navigate("/profile/help"),
        },
        {
          icon: <FileText size={20} />,
          title: "Legal & Privacy",
          description: "Read our terms of service and privacy policy",
          onClick: () => navigate("/profile/legal"),
        },
        {
          icon: <Info size={20} />,
          title: "About SUITE",
          description: "Learn more about the SUITE platform and its features",
          onClick: () => navigate("/profile/about"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="flex items-center border-b border-border-primary pb-3 mb-4">
        <button onClick={handleGoBack} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-primary flex-1 text-center">
          Settings
        </h2>
        <div className="w-8" />
      </div>

      <div className="space-y-6">
        {settingsSections.map(({ title, items }) => (
          <div key={title}>
            <p className="text-lg font-medium text-primary mb-3">{title}</p>
            <Card variant="default">
              {items.map((item, index) => (
                <SettingItem key={index} {...item} />
              ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
