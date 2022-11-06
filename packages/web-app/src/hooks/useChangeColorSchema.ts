import useFetch from '@/hooks/useFetch';
import { ColorSchemes } from '@/types/color-schemes';
import { useSetCSSVariable } from '@/hooks/useCssVariables';

export const useChangeColorSchema = async () => {
  const response = await useFetch.get<ColorSchemes>('/color-schemes.json');
  const colorSchemes = await response.json();

  const applyColorSchema = (schemaName: string) => {
    if (colorSchemes[schemaName]) {
      const colors = colorSchemes[schemaName];
      Object.entries(colors).forEach(([key, value]) => useSetCSSVariable(key, value));
    }
  };

  return {
    applyColorSchema,
  };
};
