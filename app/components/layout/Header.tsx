import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';
import { useAuth } from '@/app/context/AuthContext';

export const Header = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border-subtle z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md flex items-center justify-between">
        <Link href="/" className="text-2xl font-black italic tracking-tighter text-primary">
          Hexa<span className="text-foreground">Quiz</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/profile" className="w-10 h-10 rounded-full bg-surface-elevated border border-border-standard flex items-center justify-center overflow-hidden hover:border-primary transition-colors relative">
            {user?.profileUser && user.profileUser !== "N/A" ? (
              <Image
                src={user.profileUser}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
