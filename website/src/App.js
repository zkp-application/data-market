import { hot } from 'react-hot-loader/root';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import zh_CN from './conf/locales/zh';
import en_US from './conf/locales/en';

import Home from '@/pages/home/home';
import Profile from '@/pages/user/profile';
import Create from '@/pages/create/create';
import About from '@/pages/about/about';
import Guide from '@/pages/about/guide';
import Detail from '@/pages/detail/detail';

import '@/assets/common.scss';

const App = () => {
  const config = useSelector((state) => state.config);
  return (
    <IntlProvider locale={config.lang} messages={{ zh: zh_CN, en: en_US }[config.lang]}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/create" render={() => <Create />} />
          <Route exact path="/profile" render={() => <Profile />} />
          <Route exact path="/about" render={() => <About />} />
          <Route exact path="/guide" render={() => <Guide />} />
          <Route exact path="/detail/:id/:hash" render={() => <Detail />} />
          <Redirect to={'/'} />
        </Switch>
      </BrowserRouter>
    </IntlProvider>
  );
};

export default hot(App);
