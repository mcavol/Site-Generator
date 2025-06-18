import { Cpu } from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors">
      <Cpu size={32} aria-hidden="true" />
      <span className="font-headline text-2xl font-bold">WebForge AI</span>
    </Link>
  );
};

export default Logo;
