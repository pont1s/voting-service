import useFetch from '@/hooks/useFetch';
import { config } from '@/config';

const urlDomain = 'users';

export const registration = async (registrationUserDto: object) => {
  const response = await useFetch
    .post(`${config.urlRest}/${config.apiVersion}/${urlDomain}/registration`, registrationUserDto);
  const result = await response.json();
  return result;
};
