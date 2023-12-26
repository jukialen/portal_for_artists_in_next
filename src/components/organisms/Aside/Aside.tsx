import { getScopedI18n } from "locales/server";

import { AsideWrapper } from "components/molecules/AsideWrapper/AsideWrapper";

export  async function Aside() {
  const tAside = await getScopedI18n('Aside');
  
  return <AsideWrapper asideCategory={tAside('category')} />
}
