'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function LandingSections({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const actions = container.previousElementSibling?.querySelector('.hero-actions');
    const sections = Array.from(container.querySelectorAll('section'));
    const visible = new Set<Element>();
    let ready = !actions || actions.getBoundingClientRect().bottom <= 0;

    function reveal() {
      if (!ready) return;
      let delay = 0;
      for (const section of sections) {
        if (!visible.has(section) || section.hasAttribute('data-revealed')) continue;
        section.style.setProperty('--section-delay', delay + 'ms');
        section.setAttribute('data-revealed', '');
        observer.unobserve(section);
        delay += 140;
      }
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      // Direct links and visitors scrolling past the intro can start here.
      if (actions && actions.getBoundingClientRect().bottom <= 0) ready = true;
      reveal();
    });
    function finish(event: Event) {
      if ((event as AnimationEvent).animationName !== 'stagger-in' ||
          event.target !== actions?.lastElementChild) return;
      ready = true;
      reveal();
    }
    actions?.addEventListener('animationend', finish);
    if (actions?.lastElementChild?.getAnimations().some(a => a.playState === 'finished')) ready = true;
    sections.forEach(section => observer.observe(section));
    return () => {
      observer.disconnect();
      actions?.removeEventListener('animationend', finish);
    };
  }, []);

  return <div className="landing-sections" ref={root}>{children}</div>;
}
