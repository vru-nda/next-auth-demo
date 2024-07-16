import {Fragment} from 'react';

import MainNavigation from './main-navigation';
import {SessionProvider} from 'next-auth/react';

function Layout(props) {
  return (
    <Fragment>
      <SessionProvider>
        <MainNavigation />
        <main>{props.children}</main>
      </SessionProvider>
    </Fragment>
  );
}

export default Layout;
