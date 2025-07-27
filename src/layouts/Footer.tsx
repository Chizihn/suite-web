import type React from "react"
import { Github, Twitter, DiscIcon as Discord } from "lucide-react"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()


  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Discord, href: "#", label: "Discord" },
  ]

  return (
    <footer className="bg-surface-primary text-text-secondary mt-8 pt-10 border-t border-gray-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center text-center space-y-8">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold text-gradient mb-2">Sui.te</h3>
          <p className="max-w-md mx-auto">
            The future of hotel bookings on the Sui blockchain. Transparent, secure, and decentralized hospitality.
          </p>
        </div>

        {/* Social icons */}
        <div className="flex space-x-6">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="hover:text-text-primary"
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-sm">&copy; {currentYear} Sui.te. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
