import type { Price, Duration, CreditRecognition, Opportunity } from './types';

export function formatPrice(price: Price): string {
  if (price.kind === 'free') return 'Free';
  if (price.kind === 'known') return `$${price.amount}`;
  return 'Price not confirmed';
}

export function formatDuration(duration: Duration): string {
  if (duration.kind === 'known') {
    return `${duration.value} ${duration.unit}`;
  }
  if (duration.kind === 'self-paced') {
    return duration.estimate ? `Self-paced (${duration.estimate})` : 'Self-paced';
  }
  return 'Duration not confirmed';
}

export function formatDelivery(opp: Opportunity): string {
  const { availability } = opp;
  if (availability.mode === 'online') return 'Online';
  if (availability.mode === 'in-person') {
    const juris = availability.jurisdictions.join(', ');
    return `In person — ${juris}`;
  }
  return 'Online / In person';
}

export function creditLabel(cr: CreditRecognition): string {
  switch (cr.kind) {
    case 'verified-institution-policy':
      return 'Verified published credit policy';
    case 'possible-institution-approval':
      return 'Potential credit — confirm with institution/advisor';
    case 'certification-or-required-training':
      return 'Certification / Required training';
    case 'skills-only':
      return 'Skills only';
  }
}

export function creditDisclaimer(cr: CreditRecognition): string {
  switch (cr.kind) {
    case 'verified-institution-policy':
      return `Institution: ${cr.institution}. Conditions: ${cr.conditions}`;
    case 'possible-institution-approval':
      return cr.disclaimer;
    case 'certification-or-required-training':
      return cr.disclaimer;
    case 'skills-only':
      return cr.disclaimer;
  }
}

export function categoryLabel(category: Opportunity['category']): string {
  switch (category) {
    case 'course': return 'Course';
    case 'exam-preparation': return 'Exam preparation';
    case 'exam': return 'Exam';
    case 'certification-preparation': return 'Certification preparation';
    case 'required-training': return 'Required training';
  }
}

export function topicLabel(topic: string): string {
  switch (topic) {
    case 'cybersecurity': return 'Cybersecurity';
    case 'networking': return 'Networking';
    case 'information-technology': return 'Information Technology';
    case 'alternative-credit': return 'Alternative Credit';
    case 'responsible-vendor': return 'Responsible Vendor';
    case 'career-skills': return 'Career Skills';
    default: return topic;
  }
}
