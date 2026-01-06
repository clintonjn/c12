import { isIOS } from '../utils/platformUtil';

export const fontFamilies = {
  UBUNTU_MONO: {
    regular: isIOS() ? 'Ubuntu Mono' : 'UbuntuMono-Regular',
    bold: isIOS() ? 'Ubuntu Mono' : 'UbuntuMono-Bold',
    italic: isIOS() ? 'Ubuntu Mono' : 'UbuntuMono-Italic',
    boldItalic: isIOS() ? 'Ubuntu Mono' : 'UbuntuMono-BoldItalic',
  },
};
