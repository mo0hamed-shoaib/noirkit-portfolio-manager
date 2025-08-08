import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-icon.png"
              alt="NoirKit Logo"
              width={24}
              height={24}
              className="rounded-lg"
            />
            <span className="text-sm font-mono font-medium">NoirKit</span>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center">
            © Mohamed Gamal 2025
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/mo0hamed-shoaib/noirkit-portfolio-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="NoirKit on GitHub"
            >
              <Github className="w-4 h-4 mb-1" />
              <span>NoirKit on GitHub</span>
            </Link>
            <span className="text-xs text-muted-foreground">|</span>
            <Link
              href="https://www.linkedin.com/in/mohamed-g-shoaib/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="My LinkedIn"
            >
              <Linkedin className="w-4 h-4 mb-1" />
              <span>My LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 