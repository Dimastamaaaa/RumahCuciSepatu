import React from 'react';
import { MenuIcon, Search, Sun, Moon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function FloatingHeader({ theme, setTheme, onTrackClick }) {
  const [open, setOpen] = React.useState(false);

  const links = [
    { label: 'Proses', href: '#proses' },
    { label: 'Layanan & Harga', href: '#layanan' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kata Pelanggan', href: '#testimoni' },
    { label: 'Beri Feedback', href: '#feedback' },
  ];

  return (
    <header
      className={cn(
        'fixed top-5 left-1/2 -translate-x-1/2 z-50',
        'w-[calc(100%-2rem)] max-w-5xl rounded-2xl border border-line-soft shadow-lg',
        'bg-card/80 supports-[backdrop-filter]:bg-card/60 backdrop-blur-xl',
        'transition-all duration-300'
      )}
    >
      <nav className="mx-auto flex items-center justify-between p-2">
        {/* Brand */}
        <Link to="/" className="hover:bg-accent/10 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 duration-200">
          <img src="/rcs.svg" alt="Logo" className={cn("size-6", theme === 'dark' && "invert")} />
          <p className="font-bold text-lg tracking-tight text-ink">RCSlaundry</p>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-ink-soft hover:text-ink font-medium' })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pr-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-ink-soft hover:text-ink rounded-xl"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Button 
            size="sm" 
            className="hidden sm:flex rounded-xl bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 gap-2"
            onClick={onTrackClick}
          >
            <Search className="size-4" /> Lacak Sepatu
          </Button>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(!open)}
              className="lg:hidden rounded-xl"
            >
              <MenuIcon className="size-4" />
            </Button>
            <SheetContent
              className="bg-card/95 supports-[backdrop-filter]:bg-card/80 gap-0 backdrop-blur-2xl border-l border-line-soft"
              showClose={false}
              side="left"
            >
              <div className="flex items-center gap-2 px-4 pt-8 pb-4">
                <img src="/rcs.svg" alt="Logo" className={cn("size-8", theme === 'dark' && "invert")} />
                <p className="font-bold text-xl text-ink">RCSlaundry</p>
              </div>
              <div className="grid gap-y-2 overflow-y-auto px-4 py-5">
                {links.map((link) => (
                  <a
                    key={link.label}
                    className={buttonVariants({
                      variant: 'ghost',
                      className: 'justify-start text-ink-soft text-base py-6 rounded-xl',
                    })}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <SheetFooter className="mt-auto p-4 border-t border-line-soft bg-canvas-alt/50">
                <Button className="w-full bg-primary rounded-xl" onClick={() => { onTrackClick(); setOpen(false); }}>
                  Lacak Sepatu
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
