import type { PostHog } from 'posthog-js';

export type AnalyticsConfig = { key: string; host: string; app: string; enabled: boolean };
export type AnalyticsEvent = '$pageview' | '$pageleave' | '$autocapture' | 'app_opened' | 'booking_clicked' | 'outbound_clicked' |
  'download_requested' | 'drawing_export_requested' | 'drawing_export_failed' |
  'conversion_started' | 'conversion_succeeded' | 'conversion_failed' | 'conversion_cancelled';
const events = new Set<AnalyticsEvent>(['$pageview', '$pageleave', '$autocapture', 'app_opened', 'booking_clicked', 'outbound_clicked',
  'download_requested', 'drawing_export_requested', 'drawing_export_failed',
  'conversion_started', 'conversion_succeeded', 'conversion_failed', 'conversion_cancelled']);
// Replay is a new purpose: a previous analytics opt-in is not replay consent.
const consentKey = 'ajwoo_website_analytics_consent_v2';
const legacyConsentKey = 'ajwoo_analytics_consent_v1';
const safeProperties = new Set(['distinct_id', '$device_id', '$session_id', '$window_id',
  '$lib', '$lib_version', '$browser', '$browser_version', '$os', '$os_version',
  '$device_type', '$screen_height', '$screen_width', '$viewport_height', '$viewport_width',
  '$is_identified', '$process_person_profile', '$referring_domain',
  'app', 'destination_app', 'destination_domain', 'format', 'count',
  'utm_source', 'utm_medium', 'utm_campaign', '$event_type', '$pageview_id',
  '$pathname', '$host', '$prev_pageview_id', '$prev_pageview_pathname',
  '$prev_pageview_duration', '$prev_pageview_max_scroll_percentage']);
let config: AnalyticsConfig | undefined;
let client: PostHog | undefined;
let pending: Promise<void> | undefined;
let lastPage = '';

export function cleanUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url.origin + url.pathname : undefined; }
  catch { return undefined; }
}

// An allowlist also removes SDK-added initial URLs, person updates and DOM data.
export function sanitizeProperties(input: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === '$current_url') { const clean = cleanUrl(value); if (clean) output[key] = clean; }
    else if (key === '$elements' && Array.isArray(value)) {
      output[key] = value.slice(0, 20).map((element) => {
        const safe: Record<string, unknown> = {};
        for (const field of ['tag_name', 'nth_child', 'nth_of_type']) {
          if (element && ['string', 'number'].includes(typeof element[field])) safe[field] = element[field];
        }
        return safe;
      });
    }
    else if (safeProperties.has(key) && ['string', 'number', 'boolean'].includes(typeof value)) {
      output[key] = typeof value === 'string' ? value.slice(0, 200) : value as number | boolean;
    }
  }
  return output;
}

function privacySignal(): boolean {
  return navigator.doNotTrack === '1' || Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}
export function consent(): 'yes' | 'no' | undefined {
  if (typeof document === 'undefined') return undefined;
  if (privacySignal()) return 'no';
  const value = document.cookie.split('; ').find((part) => part.startsWith(consentKey + '='))?.split('=')[1];
  if (value === 'yes' || value === 'no') return value;
  // Respect old declines; ask previous opt-ins again for the broader purpose.
  return document.cookie.split('; ').includes(legacyConsentKey + '=no') ? 'no' : undefined;
}
export function configureAnalytics(value: AnalyticsConfig): boolean {
  config = value;
  return value.enabled && /^phc_/.test(value.key) && /^https:\/\/(us|eu)\.i\.posthog\.com$/.test(value.host);
}
export function analyticsAvailable(): boolean {
  return Boolean(config && config.enabled && /^phc_/.test(config.key) && /^https:\/\/(us|eu)\.i\.posthog\.com$/.test(config.host));
}
export function setConsent(value: 'yes' | 'no'): void {
  if (privacySignal()) value = 'no';
  const domain = /(^|\.)ajwoo\.com$/.test(location.hostname) ? '; Domain=ajwoo.com' : '';
  document.cookie = `${consentKey}=${value}; Path=/; Max-Age=15552000; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`;
  if (value === 'no') {
    client?.stopSessionRecording();
    client?.opt_out_capturing();
    client?.reset();
    lastPage = '';
  }
  window.dispatchEvent(new Event('ajwoo-analytics-consent'));
}
export async function startAnalytics(): Promise<void> {
  if (!analyticsAvailable() || consent() !== 'yes') {
    client?.stopSessionRecording();
    client?.opt_out_capturing();
    lastPage = '';
    return;
  }
  if (client) {
    client.opt_in_capturing({ captureEventName: false });
    client.startSessionRecording();
    return;
  }
  if (pending) return pending;
  pending = (async () => {
    const { default: posthog } = await import('posthog-js/full/no-external');
    if (consent() !== 'yes' || !config) return;
    posthog.init(config.key, {
      api_host: config.host, defaults: '2026-08-29',
      persistence: 'cookie', cross_subdomain_cookie: true, cookie_expiration: 180,
      secure_cookie: location.protocol === 'https:',
      autocapture: { dom_event_allowlist: ['click'], element_allowlist: ['a', 'button'], capture_copied_text: false },
      mask_all_text: true, mask_all_element_attributes: true,
      capture_pageview: false, capture_pageleave: true,
      capture_dead_clicks: false, capture_performance: false, capture_exceptions: false,
      disable_session_recording: false, disable_surveys: true,
      disable_conversations: true, disable_product_tours: true,
      enable_recording_console_log: false, enable_heatmaps: false,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: '[contenteditable], .ph-mask',
        maskAttributeFn: (name, value) => {
          if (['value', 'placeholder', 'title', 'alt', 'aria-label'].includes(name)) return '';
          if (name === 'href' || name === 'src') {
            if (value.startsWith('data:') || value.startsWith('blob:')) return '';
            try { return cleanUrl(new URL(value, location.origin).href) ?? ''; } catch { return ''; }
          }
          return value;
        },
        blockSelector: '.ph-no-capture, [data-private], input[type=hidden], input[type=file], iframe, canvas',
        recordCrossOriginIframes: false, recordHeaders: false, recordBody: false,
        captureCanvas: { recordCanvas: false },
        maskCapturedNetworkRequestFn: (request) => {
          const url = cleanUrl(request.name);
          return url ? { name: url, entryType: request.entryType, startTime: request.startTime, duration: request.duration } : null;
        },
      },
      disable_external_dependency_loading: true, advanced_disable_flags: false, advanced_disable_feature_flags: true,
      person_profiles: 'never', respect_dnt: true,
      save_referrer: false, save_campaign_params: false,
      get_current_url: () => cleanUrl(location.href) ?? location.origin,
      before_send: (event) => {
        if (!event || consent() !== 'yes') return null;
        // Replay has its own masked rrweb payload. The product-event allowlist
        // would strip the snapshot data and make every recording unplayable.
        if (event.event === '$snapshot') return event;
        if (!events.has(event.event as AnalyticsEvent)) return null;
        event.properties = sanitizeProperties(event.properties ?? {});
        // The ingestion API requires the SDK's public project token here.
        event.properties.token = config!.key;
        event.properties.app = config!.app;
        return event;
      },
    });
    posthog.opt_in_capturing({ captureEventName: false });
    client = posthog;
  })().catch(() => { /* Analytics must never prevent the visitor's task. */ }).finally(() => { pending = undefined; });
  return pending;
}
export function track(event: AnalyticsEvent, properties: Record<string, unknown> = {}): void {
  if (!client || !config || consent() !== 'yes' || !events.has(event)) return;
  try { client.capture(event, sanitizeProperties({ ...properties, app: config.app, $current_url: location.href })); }
  catch { /* Optional analytics cannot break app actions. */ }
}
export function trackPage(): void {
  if (!client || consent() !== 'yes') return;
  const page = location.origin + location.pathname;
  if (page === lastPage) return;
  lastPage = page;
  let referring = '$direct';
  try { if (document.referrer) referring = new URL(document.referrer).hostname; } catch { /* absent */ }
  const query = new URLSearchParams(location.search);
  track('$pageview', { $referring_domain: referring,
    utm_source: query.get('utm_source') ?? '', utm_medium: query.get('utm_medium') ?? '',
    utm_campaign: query.get('utm_campaign') ?? '' });
}
export function trackLink(event: MouseEvent): void {
  if (!(event.target instanceof Element) || (event.type === 'auxclick' && event.button !== 1)) return;
  if (event.target.closest('.ph-no-capture, [data-private]')) return;
  const link = event.target.closest('a');
  if (!link) return;
  let url: URL;
  try { url = new URL(link.href, location.href); } catch { return; }
  if (!/^https?:$/.test(url.protocol)) return;
  const properties = { destination_domain: url.hostname };
  if (['calendly.com', 'calendar.app.google', 'calendar.google.com'].includes(url.hostname)) track('booking_clicked', properties);
  else if (url.hostname !== location.hostname && /(^|\.)ajwoo\.com$/.test(url.hostname)) {
    track('app_opened', { ...properties, destination_app: url.hostname.split('.')[0] });
  } else if (link.hasAttribute('download') || url.pathname.startsWith('/downloads/')) track('download_requested', properties);
  else if (url.hostname !== location.hostname) track('outbound_clicked', properties);
}
