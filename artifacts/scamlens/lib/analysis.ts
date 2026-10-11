export type RiskLevel = 'Low' | 'Medium' | 'High';

export type AnalysisSignal = {
  id: string;
  title: string;
  detail: string;
};

export type Analysis = {
  id: string;
  content: string;
  risk: RiskLevel;
  signals: AnalysisSignal[];
  createdAt: string;
};

type RiskRule = {
  id: string;
  title: string;
  detail: string;
  weight: number;
  matches: (content: string, urls: URL[]) => boolean;
};

const rules: RiskRule[] = [
  {
    id: 'urgency',
    title: 'Pressure to act quickly',
    detail:
      'Urgent deadlines can be used to stop people from checking a request carefully.',
    weight: 1,
    matches: (content) =>
      /\b(urgent|immediately|act now|today only|within \d+ hours?|suspended today|final notice|expires? today|right away)\b/i.test(
        content,
      ),
  },
  {
    id: 'credentials',
    title: 'Request for account access',
    detail:
      'The message asks for a password, code, sign-in, or account verification. Do not share passwords or one-time codes from a message link.',
    weight: 2,
    matches: (content) =>
      /\b(password|one[- ]time (?:passcode|code)|verification code|security code|otp|sign[ -]?in|log[ -]?in|verify your (?:account|identity)|confirm your (?:account|identity))\b/i.test(
        content,
      ),
  },
  {
    id: 'money',
    title: 'Money, fee, or valuable item requested',
    detail:
      'The message mentions a payment, fee, gift card, cryptocurrency, or prize. Independently verify unexpected money requests.',
    weight: 1,
    matches: (content) =>
      /\b(gift cards?|bank transfer|wire transfer|bitcoin|cryptocurrency|crypto|payment|pay (?:now|a|the)|redelivery fee|processing fee|prize|winner|claim your reward|refund)\b/i.test(
        content,
      ),
  },
  {
    id: 'short-link',
    title: 'Link hides its destination',
    detail:
      'A link-shortening service hides the final website address. Avoid entering personal details unless you verify the destination independently.',
    weight: 2,
    matches: (_content, urls) =>
      urls.some((url) =>
        ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'cutt.ly', 'shorturl.at'].some(
          (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
        ),
      ),
  },
  {
    id: 'unencrypted-link',
    title: 'Link does not use HTTPS',
    detail:
      'The visible link starts with HTTP rather than HTTPS. This alone does not prove a scam, but it is worth extra caution.',
    weight: 1,
    matches: (_content, urls) => urls.some((url) => url.protocol === 'http:'),
  },
  {
    id: 'isolation',
    title: 'Discourages independent checking',
    detail:
      'The message asks you not to call, tell anyone, or verify the request. Contact the person or organization through a trusted channel instead.',
    weight: 2,
    matches: (content) =>
      /\b(don't call|do not call|don't tell anyone|do not tell anyone|keep (?:this|it) confidential|don't share|do not share|don't verify|do not verify)\b/i.test(
        content,
      ),
  },
];

function extractUrls(content: string): URL[] {
  const candidates = content.match(/\b(?:https?:\/\/|www\.)[^\s<>"']+/gi) ?? [];
  return candidates.flatMap((candidate) => {
    const cleaned = candidate.replace(/[),.!?;:]+$/, '');
    try {
      return [new URL(cleaned.startsWith('www.') ? `https://${cleaned}` : cleaned)];
    } catch {
      return [];
    }
  });
}

export function analyzeText(content: string): Omit<Analysis, 'id' | 'createdAt'> {
  const urls = extractUrls(content);
  const signals = rules
    .filter((rule) => rule.matches(content, urls))
    .map(({ id, title, detail }) => ({ id, title, detail }));
  const score = rules
    .filter((rule) => rule.matches(content, urls))
    .reduce((total, rule) => total + rule.weight, 0);

  const risk: RiskLevel = score >= 4 ? 'High' : score >= 2 ? 'Medium' : 'Low';

  if (signals.length === 0) {
    signals.push({
      id: 'no-match',
      title: 'No strong signals matched',
      detail:
        'This demo did not find any of its listed warning patterns. It cannot confirm that a message or link is legitimate.',
    });
  }

  return { content, risk, signals };
}

export const EXAMPLE_MESSAGES = [
  {
    label: 'Account alert',
    message:
      'URGENT: Your account is suspended today. Verify your password now: https://bit.ly/account-review',
  },
  {
    label: 'Delivery fee',
    message:
      'Your parcel is on hold. Pay the redelivery fee today at http://parcel-support.example/redelivery',
  },
  {
    label: 'Gift card request',
    message:
      "I need gift cards right away for a client. Don't call, I'm in a meeting — send the codes here.",
  },
];

export function riskColorKey(risk: RiskLevel): 'riskLow' | 'riskMedium' | 'riskHigh' {
  return risk === 'High' ? 'riskHigh' : risk === 'Medium' ? 'riskMedium' : 'riskLow';
}
