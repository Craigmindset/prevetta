import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/images/prevetta-arcon-logo.png" alt="Prevetta ARCON Logo" className="h-6 w-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered creative vetting for advertising professionals.
            </p>
          </div>

          {/* Mobile: 3 columns in one row, Desktop: separate columns */}
          <div className="grid grid-cols-3 gap-4 md:col-span-3 md:grid-cols-3">
            <div>
              <h3 className="font-medium mb-4 text-sm font-poppins">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="text-xs md:text-sm hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs md:text-sm hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4 text-sm font-poppins">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="text-xs md:text-sm hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs md:text-sm hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs md:text-sm hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4 text-sm font-poppins">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="text-xs md:text-sm hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs md:text-sm hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs md:text-sm hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="text-sm">&copy; 2024 Prevetta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
