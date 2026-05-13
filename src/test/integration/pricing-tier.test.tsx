import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PricingTierBlock } from '@/components/blocks/pricing-tier';
import { ThemeProvider } from 'next-themes';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('PricingTierBlock Integration', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider attribute="class" defaultTheme="light">
        {ui}
      </ThemeProvider>
    );
  };

  it('should toggle between monthly and annual billing', async () => {
    renderWithTheme(<PricingTierBlock />);

    // Initial state (Monthly)
    // Pro monthly price is 49. Starter is 0. Enterprise is 149.
    // Note: PriceDisplay uses motion.span with rounded value. 
    // In tests, we might see the final value or 0 depending on timing.
    // However, since we mock animate or wait, it should be fine.
    
    const switchElement = screen.getByLabelText(/Toggle annual billing/i);
    expect(switchElement).not.toBeChecked();

    // Starter should say "Free" (Multiple mentions of free might exist in marketing copy)
    const freeElements = screen.getAllByText(/Free/i);
    expect(freeElements.length).toBeGreaterThan(0);

    // Check Pro price (Monthly: 49)
    // We look for the text "49" next to the Pro tier
    const proSection = screen.getByText('Pro').closest('div');
    // Price is animated, so we might need to wait or check initial state if not animated
    // Since PriceDisplay starts at 0 and animates to 'price', we wait.
    await waitFor(() => {
      expect(screen.getByText('49')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Toggle to Annual
    fireEvent.click(switchElement);
    expect(switchElement).toBeChecked();

    // Check Pro price (Annual: 39)
    await waitFor(() => {
      expect(screen.getByText('39')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Check for the discount badge
    expect(screen.getByText(/Save up to 20%/i)).toBeInTheDocument();

    // Toggle back to Monthly
    fireEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();

    await waitFor(() => {
      expect(screen.getByText('49')).toBeInTheDocument();
    });
  });

  it('should call onSelectPlan with correct arguments', async () => {
    const onSelectPlan = vi.fn();
    renderWithTheme(<PricingTierBlock onSelectPlan={onSelectPlan} />);

    const proButton = screen.getByLabelText(/Select Pro plan/i);
    fireEvent.click(proButton);

    expect(onSelectPlan).toHaveBeenCalledWith('pro', 'monthly');

    // Toggle to annual and click again
    const switchElement = screen.getByLabelText(/Toggle annual billing/i);
    fireEvent.click(switchElement);
    
    fireEvent.click(proButton);
    expect(onSelectPlan).toHaveBeenCalledWith('pro', 'annual');
  });
});
