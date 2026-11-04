import type { Opportunity, Price, Duration, CreditRecognition, Verification } from './types';

export type ValidationError = { id: string; field: string; message: string };

function isHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidDateString(s: string): boolean {
  // Accepts YYYY-M-D or YYYY-MM-DD
  return /^\d{4}-\d{1,2}-\d{1,2}$/.test(s);
}

function validatePrice(id: string, price: Price): ValidationError[] {
  const errs: ValidationError[] = [];
  if (price.kind === 'free') {
    if (price.amount !== 0) errs.push({ id, field: 'price.amount', message: 'free price must have amount 0' });
    if (!isHttpsUrl(price.evidenceUrl)) errs.push({ id, field: 'price.evidenceUrl', message: 'must be https' });
  } else if (price.kind === 'known') {
    if (price.amount < 0) errs.push({ id, field: 'price.amount', message: 'must be non-negative' });
    if (!isHttpsUrl(price.evidenceUrl)) errs.push({ id, field: 'price.evidenceUrl', message: 'must be https' });
  } else {
    if (!price.reason) errs.push({ id, field: 'price.reason', message: 'unknown price must have reason' });
  }
  return errs;
}

function validateDuration(id: string, duration: Duration): ValidationError[] {
  const errs: ValidationError[] = [];
  if (duration.kind === 'known') {
    if (duration.value <= 0) errs.push({ id, field: 'duration.value', message: 'must be positive' });
    if (!isHttpsUrl(duration.evidenceUrl)) errs.push({ id, field: 'duration.evidenceUrl', message: 'must be https' });
  } else if (duration.kind === 'self-paced') {
    if (!isHttpsUrl(duration.evidenceUrl)) errs.push({ id, field: 'duration.evidenceUrl', message: 'must be https' });
  } else {
    if (!duration.reason) errs.push({ id, field: 'duration.reason', message: 'unknown duration must have reason' });
  }
  return errs;
}

function validateVerification(id: string, v: Verification): ValidationError[] {
  const errs: ValidationError[] = [];
  if (!isValidDateString(v.checkedOn)) {
    errs.push({ id, field: 'verification.checkedOn', message: 'must be YYYY-M-D or YYYY-MM-DD' });
  }
  if (v.sourceUrls.length === 0) {
    errs.push({ id, field: 'verification.sourceUrls', message: 'at least one source URL required' });
  }
  for (const url of v.sourceUrls) {
    if (!isHttpsUrl(url)) errs.push({ id, field: 'verification.sourceUrls', message: `not https: ${url}` });
  }
  if (!v.evidenceNotes) {
    errs.push({ id, field: 'verification.evidenceNotes', message: 'must not be empty' });
  }
  return errs;
}

function validateCreditRecognition(id: string, cr: CreditRecognition): ValidationError[] {
  const errs: ValidationError[] = [];
  if (cr.kind === 'verified-institution-policy') {
    if (!isHttpsUrl(cr.policyUrl)) errs.push({ id, field: 'creditRecognition.policyUrl', message: 'must be https' });
    if (!isValidDateString(cr.policyCheckedOn)) errs.push({ id, field: 'creditRecognition.policyCheckedOn', message: 'must be YYYY-M-D' });
    if (!cr.institution) errs.push({ id, field: 'creditRecognition.institution', message: 'required' });
    if (!cr.conditions) errs.push({ id, field: 'creditRecognition.conditions', message: 'required' });
  } else if (cr.kind === 'possible-institution-approval') {
    if (cr.disclaimer !== 'Credit is not guaranteed. Confirm the current policy and degree applicability with your institution.') {
      errs.push({ id, field: 'creditRecognition.disclaimer', message: 'must use the required disclaimer text' });
    }
  } else if (cr.kind === 'certification-or-required-training') {
    if (!cr.disclaimer) errs.push({ id, field: 'creditRecognition.disclaimer', message: 'required' });
  } else if (cr.kind === 'skills-only') {
    if (cr.disclaimer !== 'Skills learning only; no academic credit or credential is promised.') {
      errs.push({ id, field: 'creditRecognition.disclaimer', message: 'must use the required disclaimer text' });
    }
  }
  return errs;
}

function validateOpportunity(opp: Opportunity): ValidationError[] {
  const errs: ValidationError[] = [];
  const id = opp.id;

  if (!/^[a-z0-9-]+$/.test(id)) errs.push({ id, field: 'id', message: 'must be lowercase kebab-case' });
  if (!opp.title) errs.push({ id, field: 'title', message: 'required' });
  if (!opp.provider) errs.push({ id, field: 'provider', message: 'required' });
  if (!opp.description) errs.push({ id, field: 'description', message: 'required' });
  if (!isHttpsUrl(opp.officialUrl)) errs.push({ id, field: 'officialUrl', message: 'must be https' });
  if (opp.learnerEligibility.categories.length === 0) {
    errs.push({ id, field: 'learnerEligibility.categories', message: 'at least one category required' });
  }
  if (!opp.learnerEligibility.summary) {
    errs.push({ id, field: 'learnerEligibility.summary', message: 'required' });
  }
  if (opp.topics.length === 0) errs.push({ id, field: 'topics', message: 'at least one topic required' });

  errs.push(...validatePrice(id, opp.price));
  errs.push(...validateDuration(id, opp.duration));
  errs.push(...validateVerification(id, opp.verification));
  errs.push(...validateCreditRecognition(id, opp.creditRecognition));

  return errs;
}

export function validateCatalog(catalog: readonly Opportunity[]): ValidationError[] {
  const allErrors: ValidationError[] = [];
  const seenIds = new Set<string>();

  for (const opp of catalog) {
    if (seenIds.has(opp.id)) {
      allErrors.push({ id: opp.id, field: 'id', message: 'duplicate ID' });
    }
    seenIds.add(opp.id);
    allErrors.push(...validateOpportunity(opp));
  }

  return allErrors;
}
