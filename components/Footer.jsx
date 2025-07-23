import Link from "next/link";
import { Github, Linkedin, Code, Heart, User } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Brand and Copyright */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Code className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                PhoneStore
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                © {currentYear} by &nbsp;
                <Link
                  href="https://ab2gbl-portfolio.vercel.app/"
                  className="font-semibold text-s text-blue-600"
                >
                  @ab2gbl
                </Link>
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-3">
            <Link
              href="https://ab2gbl-portfolio.vercel.app/" // Replace with your actual portfolio URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <span className="sr-only">Portfolio</span>
              <User className="h-4 w-4" />
            </Link>

            <Link
              href="https://www.linkedin.com/in/ayoub-guebli-0615342b8/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-4 w-4" />
            </Link>

            <Link
              href="https://github.com/ab2gbl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
