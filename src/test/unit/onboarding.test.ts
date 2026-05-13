import { describe, it, expect } from 'vitest';
import { onboardingSchema } from '@/lib/validations/onboarding';

describe('Onboarding Schema Validation', () => {
  it('should validate a correct payload', () => {
    const validData = {
      fullName: 'John Doe',
      role: 'Developer',
      workspaceName: 'Nova HQ',
      workspaceSlug: 'nova-hq',
      invites: 'alex@nova.io, sarah@nova.io',
    };
    const result = onboardingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if fullName is too short', () => {
    const invalidData = {
      fullName: 'J',
      role: 'Developer',
      workspaceName: 'Nova HQ',
      workspaceSlug: 'nova-hq',
    };
    const result = onboardingSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.fullName).toContain('Name must be at least 2 characters.');
    }
  });

  it('should fail if role is missing', () => {
    const invalidData = {
      fullName: 'John Doe',
      role: '',
      workspaceName: 'Nova HQ',
      workspaceSlug: 'nova-hq',
    };
    const result = onboardingSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
