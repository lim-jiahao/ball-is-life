import JSSHA from 'jssha';

export const getUserIdHash = (input) => {
  const { SALT } = process.env;
  const shaObj = new JSSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhashedString = `${input}-${SALT}`;
  shaObj.update(unhashedString);
  return shaObj.getHash('HEX');
};

export const getPasswordHash = (input) => {
  const shaObj = new JSSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(input);
  return shaObj.getHash('HEX');
};
