import { fontFamilies } from '../constants/fonts';

export const getFontFamily = (
  fontType: 'UBUNTU_MONO' = 'UBUNTU_MONO',
  weight: 'regular' | 'bold' | 'italic' | 'boldItalic' = 'regular'
) => {
  const selectedFontFamily = fontFamilies[fontType];
  return selectedFontFamily[weight] || fontFamilies.UBUNTU_MONO.regular;
};
