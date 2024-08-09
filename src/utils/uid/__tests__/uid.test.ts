import { generateUID } from '../index';

describe('generateUID', () => {
  it('should return a string of length 4', () => {
    const uid = generateUID();
    expect(typeof uid).toBe('string');
    expect(uid.length).toBe(4);
  });

  it('should return a string with only hexadecimal characters (0-9, A-F)', () => {
    const uid = generateUID();
    expect(uid).toMatch(/^[0-9A-F]{4}$/);
  });

  it('should generate unique UIDs on multiple calls', () => {
    const uids = new Set();
    for (let i = 0; i < 50; i++) {
      uids.add(generateUID());
    }
    expect(uids.size).toBe(50);
  });
});
