import { hashPassword } from '../index';
import { hash } from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('hashPassword', () => {
  it('should hash the password with a salt of 12 rounds', async () => {
    const password = 'mySuperSecretPassword';
    const hashedValue = 'hashedPasswordValue';

    (hash as jest.Mock).mockResolvedValue(hashedValue);

    const result = await hashPassword(password);

    expect(hash).toHaveBeenCalledWith(password, 12);
    expect(result).toBe(hashedValue);
  });

  it('should throw an error if hashing fails', async () => {
    const password = 'mySuperSecretPassword';

    (hash as jest.Mock).mockRejectedValue(new Error('Hashing failed'));

    await expect(hashPassword(password)).rejects.toThrow('Hashing failed');
  });
});
