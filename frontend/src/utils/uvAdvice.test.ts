
import { getUVProtectionAdvice } from './uvAdvice';

describe('getUVProtectionAdvice', () => {
  test('returns "No protection needed" for UV <= 2', () => {
    const uv0 = getUVProtectionAdvice(0);
    expect(uv0.protectionLevel).toBe('Low');
    expect(uv0.clothingAdvice.summary).toBe("No special sun protection clothing needed");
    expect(uv0.sunscreenAdvice).toBeNull();

    const uv2 = getUVProtectionAdvice(2);
    expect(uv2.protectionLevel).toBe('Low');
    expect(uv2.clothingAdvice.summary).toBe("No special sun protection clothing needed");
    expect(uv2.sunscreenAdvice).toBeNull();
  });

  test('returns Basic protection for UV 3-5', () => {
    const uv3 = getUVProtectionAdvice(3);
    expect(uv3.protectionLevel).toBe('Moderate');
    expect(uv3.clothingAdvice.items[0].intensity).toBe('Basic');
    expect(uv3.sunscreenAdvice?.spf).toBe('15');
    expect(uv3.sunscreenAdvice?.intensity).toBe('Basic');

    const uv5 = getUVProtectionAdvice(5);
    expect(uv5.protectionLevel).toBe('Moderate');
    expect(uv5.clothingAdvice.items[0].intensity).toBe('Basic');
  });

  test('returns Enhanced protection for UV 6-7', () => {
    const uv6 = getUVProtectionAdvice(6);
    expect(uv6.protectionLevel).toBe('High');
    expect(uv6.clothingAdvice.items[0].intensity).toBe('Enhanced');
    expect(uv6.sunscreenAdvice?.spf).toBe('30');
    expect(uv6.sunscreenAdvice?.intensity).toBe('Enhanced');

    const uv7 = getUVProtectionAdvice(7);
    expect(uv7.protectionLevel).toBe('High');
    expect(uv7.clothingAdvice.items[0].intensity).toBe('Enhanced');
  });

  test('returns Professional protection for UV 8-10', () => {
    const uv8 = getUVProtectionAdvice(8);
    expect(uv8.protectionLevel).toBe('Very High');
    expect(uv8.clothingAdvice.items[0].intensity).toBe('Professional');
    expect(uv8.sunscreenAdvice?.spf).toBe('50+');
    expect(uv8.sunscreenAdvice?.intensity).toBe('Professional');

    const uv10 = getUVProtectionAdvice(10);
    expect(uv10.protectionLevel).toBe('Very High');
    expect(uv10.clothingAdvice.items[0].intensity).toBe('Professional');
  });

  test('returns Extreme protection for UV >= 11', () => {
    const uv11 = getUVProtectionAdvice(11);
    expect(uv11.protectionLevel).toBe('Extreme');
    expect(uv11.clothingAdvice.items.some(item => item.text === 'Seek shade')).toBe(true);
    expect(uv11.sunscreenAdvice?.spf).toBe('50+');
    expect(uv11.sunscreenAdvice?.reapplication).toContain('1-2 hours');
  });

  test('validates correct data source', () => {
    const result = getUVProtectionAdvice(5);
    expect(result.dataSource).toContain('WHO');
  });

  test('validates item specifications for Professional level', () => {
    const uv9 = getUVProtectionAdvice(9);
    const shirt = uv9.clothingAdvice.items.find(i => i.icon === '👕');
    expect(shirt?.specs?.upf).toBe('50+');
    expect(shirt?.specs?.color).toContain('Dark');
  });
});
