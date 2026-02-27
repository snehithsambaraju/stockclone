import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Menu from "./Menu";

const Home = () => {
  return (
    <>
      <TopBar />
      <Menu />
      <Dashboard />
    </>
  );
};

export default Home;