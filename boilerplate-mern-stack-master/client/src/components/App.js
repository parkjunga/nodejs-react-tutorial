import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import UploadProductPage from './views/UploadProductPage/UploadProductPage.js';
import DetailProductPage from './views/DetailProductPage/DetailProductPage.js';
import CartPage from './views/CartPage/CartPage.js';
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside
// step 1. 업로드 view페이지를 만든다. 2. app에 라우터를 연결한다. (이때 업로드페이지는 로그인 한 사람만 연결해야되니 Auth함수를 사용 )
function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage,true)}/> 
          {/* 아무나 들어올 수 있으니까 Auth에 두번째 매개변수 null 이 들어온다.*/}
          <Route exact path="/product/:productId" component={Auth(DetailProductPage,null)}/>  
          <Route exact path="/user/cart" component={Auth(CartPage, true)}/>
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
