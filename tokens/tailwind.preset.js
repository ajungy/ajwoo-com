/**
 * MINIMAL — Tailwind preset
 *
 * Everything maps to the CSS custom properties in tokens.css, so dark mode
 * works by flipping `data-theme` on <html>. No `dark:` variants needed for
 * color — the variable already changed underneath you.
 *
 * Setup:
 *   1. import "./tokens/tokens.css" once at your app entry.
 *   2. tailwind.config.js →  presets: [require("./tokens/tailwind.preset.js")]
 *   3. <html data-theme="light"> (or "dark", or omit to follow the OS)
 *
 * Rule: if you find yourself reaching for a raw Tailwind color like
 * `bg-gray-100`, stop. Use `bg-hover` / `bg-sunken` / etc. instead.
 */

module.exports = {
  darkMode: ['variant', '&:is([data-theme="dark"] *)'],
  theme: {
    // Canvas classes. Contiguous, no gaps. See reference/surfaces.md.
    screens: {
      compact:  '320px',   // phone portrait, folded outer display
      medium:   '600px',   // tablet portrait, phone landscape, unfolded
      expanded: '840px',   // tablet landscape, small laptop
      large:    '1200px',  // desktop
      xlarge:   '1600px',  // large desktop, TV at 1920 logical
    },
    extend: {
      colors: {
        // Surfaces
        page:     'var(--surface-page)',
        chrome:   'var(--surface-chrome)',
        raised:   'var(--surface-raised)',
        sunken:   'var(--surface-sunken)',
        overlay:  'var(--surface-overlay)',
        inverse:  'var(--surface-inverse)',
        scrim:    'var(--surface-scrim)',
        hover:    'var(--surface-hover)',
        active:   'var(--surface-active)',
        selected: 'var(--surface-selected)',

        // Text  →  text-fg, text-fg-secondary, …
        fg: {
          DEFAULT:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          disabled:  'var(--text-disabled)',
          inverse:   'var(--text-inverse)',
        },

        // Borders  →  border-line, border-line-subtle, …
        // `control` is the ≥3:1 boundary for inputs, checkboxes, radios,
        // and switch tracks — anything identified only by its outline.
        line: {
          DEFAULT: 'var(--border-default)',
          subtle:  'var(--border-subtle)',
          chrome:  'var(--border-chrome)',
          control: 'var(--border-control)',
          strong:  'var(--border-strong)',
          focus:   'var(--border-focus)',
        },

        // Actions
        primary: {
          DEFAULT:    'var(--action-primary-bg)',
          hover:      'var(--action-primary-bg-hover)',
          active:     'var(--action-primary-bg-active)',
          fg:         'var(--action-primary-fg)',
          disabled:   'var(--action-primary-bg-disabled)',
          'fg-disabled': 'var(--action-primary-fg-disabled)',
        },
        secondary: {
          DEFAULT:      'var(--action-secondary-bg)',
          hover:        'var(--action-secondary-bg-hover)',
          active:       'var(--action-secondary-bg-active)',
          fg:           'var(--action-secondary-fg)',
          line:         'var(--action-secondary-border)',
          'line-hover': 'var(--action-secondary-border-hover)',
        },
        tertiary: {
          DEFAULT: 'var(--action-tertiary-bg)',
          hover:   'var(--action-tertiary-bg-hover)',
          active:  'var(--action-tertiary-bg-active)',
          fg:      'var(--action-tertiary-fg)',
        },

        // Status — these three hues are the ONLY color in the system.
        success: {
          DEFAULT: 'var(--status-success-fg)',
          bg:      'var(--status-success-bg)',
          line:    'var(--status-success-border)',
          solid:   'var(--status-success-solid)',
        },
        warning: {
          DEFAULT: 'var(--status-warning-fg)',
          bg:      'var(--status-warning-bg)',
          line:    'var(--status-warning-border)',
          solid:   'var(--status-warning-solid)',
        },
        danger: {
          DEFAULT: 'var(--status-danger-fg)',
          bg:      'var(--status-danger-bg)',
          line:    'var(--status-danger-border)',
          solid:   'var(--status-danger-solid)',
          action:  'var(--action-danger-bg)',
          'sec-fg':     'var(--action-danger-secondary-fg)',
          'sec-line':   'var(--action-danger-secondary-border)',
          'sec-hover':  'var(--action-danger-secondary-bg-hover)',
          'ter-fg':     'var(--action-danger-tertiary-fg)',
          'ter-hover':  'var(--action-danger-tertiary-bg-hover)',
          'action-hover': 'var(--action-danger-bg-hover)',
          'action-fg':    'var(--action-danger-fg)',
        },
        neutral: {
          DEFAULT: 'var(--status-neutral-fg)',
          bg:      'var(--status-neutral-bg)',
          line:    'var(--status-neutral-border)',
        },

        skeleton: {
          DEFAULT: 'var(--skeleton-base)',
          sheen:   'var(--skeleton-sheen)',
        },

        focus: 'var(--focus-ring)',
      },

      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },

      // Each entry carries size + line-height + tracking + weight together.
      // Use `text-body`, `text-h1` — never `text-[15px]`.
      fontSize: {
        // Fluid, not stepped: the headline carries five swapped-in fonts of
        // wildly different widths (Archivo Black, Caveat, Playfair italic —
        // see HeroOverlay.tsx), so a handful of breakpoint jumps would still
        // leave gaps where the widest word overflows a narrow phone. clamp()
        // tracks viewport width continuously instead — 48px is the ceiling
        // (matches the old fixed value at desktop widths), 30px is the
        // readable floor at the narrowest supported width (compact, 320px).
        display: ['clamp(30px, 8vw, 48px)', { lineHeight: 'clamp(34px, 8.5vw, 52px)', letterSpacing: '-0.020em', fontWeight: '600' }],
        h1:      ['32px', { lineHeight: '38px', letterSpacing: '-0.014em', fontWeight: '600' }],
        h2:      ['24px', { lineHeight: '30px', letterSpacing: '-0.012em', fontWeight: '600' }],
        h3:      ['20px', { lineHeight: '26px', letterSpacing: '-0.009em', fontWeight: '600' }],
        title:   ['17px', { lineHeight: '24px', letterSpacing: '-0.006em', fontWeight: '600' }],
        'body-lg':['17px',{ lineHeight: '26px', letterSpacing: '-0.006em', fontWeight: '400' }],
        body:    ['15px', { lineHeight: '22px', letterSpacing: '-0.004em', fontWeight: '400' }],
        label:   ['14px', { lineHeight: '20px', letterSpacing: '-0.002em', fontWeight: '500' }],
        caption: ['13px', { lineHeight: '18px', letterSpacing: '0em',      fontWeight: '400' }],
        micro:   ['11px', { lineHeight: '14px', letterSpacing: '0.020em',  fontWeight: '500' }],
      },

      spacing: {
        0: '0px', 1: '2px', 2: '4px', 3: '6px', 4: '8px', 5: '12px',
        6: '16px', 7: '20px', 8: '24px', 9: '32px', 10: '40px',
        11: '48px', 12: '64px', 13: '80px', 14: '96px', 15: '128px',

        // Adaptive — these read the CSS vars, so they grow automatically on
        // coarse pointers and on TV. Prefer them over the fixed values above
        // for anything a finger has to hit.
        'control-sm': 'var(--control-h-sm)',
        'control-md': 'var(--control-h-md)',
        'control-lg': 'var(--control-h-lg)',
        'target':     'var(--hit-target-min)',
        'row':        'var(--row-h)',
        'page':       'var(--page-pad)',

        // Safe areas — notches, home indicators, TV overscan.
        'safe-t': 'var(--safe-top)',
        'safe-r': 'var(--safe-right)',
        'safe-b': 'var(--safe-bottom)',
        'safe-l': 'var(--safe-left)',
      },

      borderRadius: {
        xs:      '6px',
        sm:      '8px',
        control: '10px',
        md:      '10px',
        lg:      '14px',
        xl:      '20px',
        full:    '9999px',
      },

      backdropBlur: { chrome: 'var(--chrome-blur)' },

      boxShadow: {
        e1: 'var(--shadow-e1)',
        e2: 'var(--shadow-e2)',
        e3: 'var(--shadow-e3)',
        none: 'none',
      },

      maxWidth: {
        content: '720px',
        app:     '1200px',
        wide:    '1440px',
      },

      transitionDuration: {
        fast:   '120ms',
        base:   '180ms',
        slow:   '260ms',
        slower: '400ms',
      },

      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
        exit:     'cubic-bezier(0.4, 0, 1, 1)',
      },

      scale: {
        press: '0.98',
      },

      zIndex: {
        sticky: '100', dropdown: '200', overlay: '300',
        modal: '400', toast: '500', tooltip: '600',
      },

      keyframes: {
        'spin-minimal': { to: { transform: 'rotate(360deg)' } },
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        spinner:    'spin-minimal 700ms linear infinite',
        'fade-in':  'fade-in 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer:    'shimmer 1400ms cubic-bezier(0.2, 0, 0, 1) infinite',
      },
    },
  },

  plugins: [
    function ({ addVariant }) {
      /**
       * Capability variants. Branch on what the input can do — never on
       * device. A touch laptop is both, and both must work.
       *
       *   can-hover:bg-hover   only where a real pointer exists
       *   touch:h-11           where any pointer is coarse (incl. hybrids)
       *   fine:h-8             precise pointer only
       *   tv:text-body         [data-surface="tv"]
       */
      addVariant('can-hover', '@media (hover: hover) and (pointer: fine)');
      addVariant('touch',     '@media (any-pointer: coarse)');
      addVariant('fine',      '@media (any-pointer: fine)');
      addVariant('stylus',    '@media (any-pointer: fine) and (any-hover: none)');

      // Surfaces CSS cannot detect — set data-surface on <html>.
      addVariant('tv',     '&:is([data-surface="tv"] *)');
      addVariant('watch',  '&:is([data-surface="watch"] *)');
      addVariant('widget', '&:is([data-surface="widget"] *)');

      // Foldables — a hinge sits between the two segments.
      addVariant('folded-h', '@media (horizontal-viewport-segments: 2)');
      addVariant('folded-v', '@media (vertical-viewport-segments: 2)');

      // User preferences.
      addVariant('reduced-motion', '@media (prefers-reduced-motion: reduce)');
      addVariant('more-contrast',  '@media (prefers-contrast: more)');
    },
  ],
};

/**
 * IMPORTANT — always write hover as `can-hover:`, never bare `hover:`.
 *
 * On touch, :hover latches after a tap and sticks until the user taps
 * elsewhere, so a bare hover: state leaves controls looking permanently
 * hovered. `can-hover:` compiles to a media query that touch never matches.
 *
 *   ✗  hover:bg-primary-hover
 *   ✓  can-hover:hover:bg-primary-hover
 */
