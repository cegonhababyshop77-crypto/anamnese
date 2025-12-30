
import { AnamneseData } from '../types';

const STORAGE_KEY = 'anamnese_db_v1';

export const saveAnamnese = (data: AnamneseData): void => {
  const existing = getAnamneses();
  const updated = [...existing, data];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getAnamneses = (): AnamneseData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
