import { redirect } from "next/navigation";

import { getSSRSession } from "../sessionUtils";
import { SessionAuthForNextJS } from "./sessionAuthForNextJS";
import { TryRefreshComponent } from "./tryRefreshClientComponent";

export const checkinSession = async ({locale} : { locale: string }) => {
  const { session, hasToken, hasInvalidClaims } = await getSSRSession();

  if (!session) {
    if (!hasToken) {
      return redirect(`${locale}/signin`);
    }
    
    if (hasInvalidClaims) {
      return <SessionAuthForNextJS />;
    } else {
      return <TryRefreshComponent />;
    }
  }
}