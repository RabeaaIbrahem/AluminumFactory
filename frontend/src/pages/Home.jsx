import React from "react";
import Main from '../components/main/home.jsx';
import Header from "../components/header/HeaderHome.jsx";
import Footer from "../components/footer/Footer.jsx";
function Home(){
  return (
    <div>
    {/* header component */}
      <Header/>
    {/* main component */}
      <Main />
    {/* footer component */}
      <Footer/>
    </div>
  );
}
export default Home;