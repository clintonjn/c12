import { fontFamilies } from '../constants/fonts';

export const getFontFamily = (
  fontType: 'UBUNTU_MONO' | 'GRUPPO' = 'UBUNTU_MONO',
  weight: 'regular' | 'bold' | 'italic' | 'boldItalic' = 'regular'
) => {
  const selectedFontFamily = fontFamilies[fontType];
  return selectedFontFamily[weight] || fontFamilies.UBUNTU_MONO.regular;
};
