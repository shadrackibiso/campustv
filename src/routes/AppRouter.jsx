import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "./Home";
import SignUp from "./SignUp";
import Contestants from "./Contestants";
import Profile from "./Profile";
import Admin from "./Admin";
import ErrorPage from "./404";

function AppRouter() {
  return (
    <BrowserRouter>
      <div>
        {/* NAVBAR */}
        <Navbar />
        {/*  */}
        <Switch>
          <Route path="/" exact>
            <SignUp />
          </Route>
          <Route path="/registre">
            <SignUp />
          </Route>
          <Route path="/contestant/:id" render={(props) => <Profile {...props} />} />
          <Route path="/contestants">
            <Contestants />
          </Route>
          <Route path="/my-admin">
            <Admin />
          </Route>
          <Route>
            <ErrorPage />
          </Route>
        </Switch>
        {/* FOOTER */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
