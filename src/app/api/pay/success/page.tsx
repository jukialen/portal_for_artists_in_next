import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { createServer } from '../../../../utils/supabase/clientSSR';
import { getUserData } from '../../../../helpers/getUserData';

import { HeadCom } from '../../../../constants/HeadCom';
import { LangType, Plan } from '../../../../types/global.types';

export const metadata: Metadata = HeadCom('Page for successful payment');

const updatePlan = async (newPlan: Plan) => {
  const supabase = await createServer();
  const userData = await getUserData();

  const { error } = await supabase.from('Users').update({ plan: newPlan }).eq('id', userData?.id!);
};

export default async function PaySuccess({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return 'Success!';
}
