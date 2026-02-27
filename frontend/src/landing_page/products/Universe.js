import React from "react";
import "./universe.css"; // 👈 create this css file

export default function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>
      </div>

      <div className="row mt-4">
        <div className="col-4 p-3 text-center">
        <a href="https://www.zerodhafundhouse.com/" > <img src="/media-images/ZerodhaFundhouse (1).png" className="universe-img" alt="" /></a>
          <p className="text-small text-muted">
            Our asset management venture that is creating simple and transparent index
            funds to help you save for your goals.
          </p>
        </div>

        <div className="col-4 p-3 text-center">
          <a href="https://sensibull.com/"><img src="/media-images/sensibullLogo.svg" className="universe-img" alt="" /></a>
          <p className="text-small text-muted">
            Options trading platform that lets you create strategies, analyze positions,
            and examine data points like open interest, FII/DII, and more.
          </p>
        </div>

        <div className="col-4 p-3 text-center">
           <a href="https://www.streak.tech/home"> <img src="/media-images/streakLogo.png" className="universe-img" alt="" /></a>
          <p className="text-small text-muted">
            Systematic trading platform that allows you to create and backtest strategies without coding.
          </p>
        </div>

        <div className="col-4 p-3 text-center">
            <a href="https://www.smallcase.com/"><img src="/media-images/smallcaseLogo.png" className="universe-img" alt="" /></a>
          <p className="text-small text-muted">
            Thematic investment platform that helps you invest in diversified baskets of stocks or ETFs.
          </p>
        </div>

        <div className="col-4 p-3 text-center">
            <a href="https://www.tijorifinance.com/dashboard/"><img src="/media-images/Tijori.png" className="universe-img" alt="" /></a>
          <p className="text-small text-muted">
            Investment research platform that offers detailed insights on stocks, sectors,
            supply chains, and more.
          </p>
        </div>

        <div className="col-4 p-3 text-center">
           <a href="https://joinditto.in/ask-ditto/"> <img src="/media-images/dittoLogo.png" className="universe-img" alt="" /></a>
          <p className="text-small text-muted">
            Personalized advice on life and health insurance. No spam and no mis-selling.
          </p>
          </div>
          <button
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", margin: "0 auto" }}
        >
          Signup Now
        </button>


       
      </div>
    </div>
  );
}
