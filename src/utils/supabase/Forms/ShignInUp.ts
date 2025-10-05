'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createServer } from '../clientSSR';
import * as Yup from 'yup';
import { getScopedI18n } from 'locales/server';

const validationData = async (formData: FormData) => {
  const ts = await getScopedI18n('NavForm');

  const email = Yup.string().email(ts('validateEmail')).required(ts('validateRequired'));
  const password = Yup.string()
    .min(9, ts('validatePasswordNum'))
    .max(72, ts('validatePasswordMax'))
    .matches(/[A-Z]+/g, ts('validatePasswordOl'))
    .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, ts('validatePasswordHKik'))
    .matches(/[0-9]+/g, ts('validatePasswordOn'))
    .matches(/[#?!@$%^&*-]+/g, ts('validatePasswordSpec'))
    .required(ts('validateRequired'));

  const schemaValidation = Yup.object({ email, password });
  const rawData = Object.fromEntries(formData.entries());

  return await schemaValidation.validate(rawData, { abortEarly: false });
};

export async function login(formData: FormData, translated: { theSameEmail: string; error: string }) {
  const supabase = await createServer();

  try {
    const valicationResult = await validationData(formData);
    if (!valicationResult) throw redirect('/error');

    const { error } = await supabase.auth.signInWithPassword(valicationResult);

    if (!!error) {
      if (
        error.message.includes('User already registered') ||
        error.message.includes('User already exists') ||
        error.message === 'Email not confirmed'
      ) {
        return translated.theSameEmail;
      } else {
        return translated.error;
      }
    }
    revalidatePath('/', 'layout');
    redirect('/auth/callback');
  } catch (e) {
    if (e instanceof Yup.ValidationError) {
      // Obsługa błędów walidacji
      const errors = e.inner.reduce(
        (acc, err) => {
          if (err.path) {
            acc[err.path] = err.message;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Zwróć błędy zamiast przekierowywać
      return { success: false, errors };
    }

    // Obsługa innych błędów
    console.error('Login error:', e);
    redirect('/error');
  }
}

export async function signup(formData: FormData) {
  const supabase = await createServer();

  const valicationResult = await validationData(formData);

  if (!valicationResult) throw redirect('/error');

  const { error } = await supabase.auth.signUp(valicationResult);

  if (error) redirect('/error');

  revalidatePath('/', 'layout');
  redirect('/auth/callback');
}
