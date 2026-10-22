import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Dashboard', active: true },
  { href: '/profile', label: 'Profile', active: false },
  { href: '/services', label: 'Services', active: false },
  { href: '/portfolio', label: 'Portfolio', active: false },
  { href: '/diary', label: 'Diary', active: false },
  { href: '/chat', label: 'Chat', active: false },
  { href: '/check-in', label: 'Check-in', active: false },
  { href: '/payouts', label: 'Payouts', active: false },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-10 flex h-full w-[250px] flex-col border-r border-[#dfe7e5] bg-[#f4f7f6]">
      <div className="px-7 pb-6 pt-9 text-[19px] font-bold tracking-[-0.03em] text-[#1d2b2a]">
        <span className="font-serif">EventHub</span>
      </div>

      <div className="px-7 pb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#899896]">
        Vendor
      </div>

      <nav className="flex-1 space-y-1 px-3 pb-7 pt-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={[
              'block rounded-[10px] px-5 py-3 text-[17px] font-medium transition-colors duration-200',
              item.active
                ? 'border-l-[4px] border-[#1a4d45] bg-[#dfeceb] text-[#1d4d47] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
                : 'text-[#5c6a69] hover:bg-[#edf4f2] hover:text-[#1a3d38]',
            ].join(' ')}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}