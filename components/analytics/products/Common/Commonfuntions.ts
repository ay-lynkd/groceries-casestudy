import { theme } from '@/theme/appTheme';
const { colors } = theme;
export const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return { name: 'trending-up', color: colors.status.success };
      case 'down': return { name: 'trending-down', color: colors.status.error };
      default: return { name: 'remove', color: colors.text.light };
    }
  };