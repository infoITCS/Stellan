import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, FocusEvent as ReactFocusEvent } from 'react';
import { BrandLockup } from './Brand.tsx';
import { Icon } from './Icon.tsx';
import { siteConfig } from '../site.ts';
import type { NavigationItem } from '../site.ts';

interface HeaderProps {
  pathname: string;
}

export function Header({ pathname }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) {
        return;
      }

      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])'));
      if (focusable.length === 0) {
        menuButtonRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === menuButtonRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  useEffect(() => {
    if (!servicesOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [servicesOpen]);

  const openServices = () => {
    window.clearTimeout(closeTimerRef.current);
    setServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setServicesOpen(false), 140);
  };

  const handleServicesKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openServices();
      window.requestAnimationFrame(() => {
        servicesRef.current?.querySelector<HTMLAnchorElement>('.nav-mega-link')?.focus();
      });
    }
  };

  const handleServicesBlur = (event: ReactFocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setServicesOpen(false);
    }
  };

  const servicesItem = siteConfig.navigation.find((item) => item.children?.length);

  const renderMobileLink = (item: NavigationItem, index: number) => (
    <div className="mobile-nav-group" key={item.href}>
      <a
        aria-current={isActive(item.href) ? 'page' : undefined}
        className="mobile-nav-link"
        href={item.href}
        onClick={() => setOpen(false)}
        ref={index === 0 ? firstLinkRef : undefined}
        tabIndex={open ? 0 : -1}
      >
        <span>{item.label}</span>
        <Icon name="arrow-up-right" size={18} />
      </a>
      {item.children?.length ? (
        <div className="mobile-nav-sub">
          {item.children.map((child) => (
            <a className="mobile-nav-sublink" href={child.href} key={child.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              {child.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <header className="site-header">
      <div className="header-inner container">
        <a aria-label="Stellan Solutions home" className="brand-link" href="/" onClick={() => setOpen(false)}>
          <BrandLockup />
        </a>
        <div className="header-context">
          <span className="status-dot" aria-hidden="true" />
          <span>Remote technology partnership</span>
        </div>
        <nav aria-label="Primary navigation" className="desktop-nav">
          <ul className="desktop-nav-list">
          {siteConfig.navigation.map((item) => (
            <li
              className={`nav-item${servicesItem?.href === item.href ? ' nav-item-has-mega' : ''}`}
              key={item.href}
              onBlur={item.children?.length ? handleServicesBlur : undefined}
              onMouseEnter={item.children?.length ? openServices : undefined}
              onMouseLeave={item.children?.length ? scheduleCloseServices : undefined}
              ref={item.children?.length ? servicesRef : undefined}
            >
              {item.children?.length ? (
                <button
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  className="nav-link nav-link-toggle"
                  onClick={openServices}
                  onKeyDown={handleServicesKeyDown}
                  type="button"
                >
                  {item.label}
                  <Icon name="chevron-down" size={14} />
                </button>
              ) : (
                <a aria-current={isActive(item.href) ? 'page' : undefined} className="nav-link" href={item.href}>
                  {item.label}
                </a>
              )}
              {item.children?.length ? (
                <div className="nav-mega" hidden={!servicesOpen}>
                  <div className="container">
                    <div className="nav-mega-inner">
                      <div className="nav-mega-side">
                        <p className="nav-mega-eyebrow">{item.label}</p>
                        <p className="nav-mega-description">{item.description}</p>
                        <a className="nav-mega-all" href={item.href} onClick={() => setServicesOpen(false)}>
                          View all services
                          <Icon name="arrow-up-right" size={15} />
                        </a>
                      </div>
                      <ul className="nav-mega-grid">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              aria-current={isActive(child.href) ? 'page' : undefined}
                              className="nav-mega-link"
                              href={child.href}
                              onClick={() => setServicesOpen(false)}
                            >
                              <span className="nav-mega-link-label">{child.label}</span>
                              {child.description ? <span className="nav-mega-link-description">{child.description}</span> : null}
                          </a>
                        </li>
                      ))}
                    </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </li>
          ))}
          </ul>
        </nav>
        <a className="button button-small button-dark header-cta" href="/contact">
          Start a conversation
          <Icon name="arrow-up-right" size={16} />
        </a>
        <button
          aria-controls="mobile-drawer"
          aria-expanded={open}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          className="menu-button"
          onClick={() => setOpen((current) => !current)}
          ref={menuButtonRef}
          type="button"
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </div>
      <div aria-hidden={!open} className={`mobile-drawer${open ? ' is-open' : ''}`} id="mobile-drawer" ref={drawerRef}>
        <div className="mobile-drawer-inner">
          <p className="eyebrow">Navigate Stellan</p>
          <nav aria-label="Mobile navigation" className="mobile-nav">
            {siteConfig.navigation.map(renderMobileLink)}
          </nav>
          <a className="button button-primary mobile-drawer-cta" href="/contact" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Talk through a challenge
            <Icon name="arrow-up-right" size={17} />
          </a>
          <p className="drawer-note">Remote partnership for distributed teams.</p>
        </div>
      </div>
    </header>
  );
}
