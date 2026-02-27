import React from "react";
import { Link } from "react-router-dom";

function CreateTicket() {
  return (
       <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2">To create a ticket, select a relevant topic</h1>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4 className="">
            <i className="fa fa-plus-circle" aria-hidden="true"></i> Account Opening
          </h4>
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Online Account Opening
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Offline Account Opening
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Company, Partnership and HUF Account
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Opening
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            NRI Account Opening
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Charges at Zerodha
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Zerodha IDFC FIRST Bank 3-in-1 Account
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Getting Started
          </Link>
          <br />
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4 className="">
         <i className="fa-solid fa-address-card"></i>Your Zerodha Account
          </h4>
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Your Profile
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          Account modication
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            Client Master Report(CMR) and Depository Participant(DP)
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
             Nomination
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
           Transfer and conversion of securities
          </Link>
     
          <br />
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4 className="">
          <i className="fa-solid fa-kite"></i>Kite
          </h4>
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          IPO
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
           Trading FAQs
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
           Margin Trading Facility(MTF) and Margins
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          Charts and orders
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
           Alert and Nudges
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          General
          </Link>
          <br />
         
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4 className="">
            <i className="fa-solid fa-indian-rupee-sign"></i>Funds
         </h4>
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
           Add money
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
           Withdraw Money
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          Add bank accounts
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            eMandates
          </Link>
          <br />
      
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4 className="">
         <i className="fa-solid fa-circle"></i>Console
          </h4>
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
         
         Portfolio
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
           Corporate actions
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          Funds statement
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
         Reports
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          Profile
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          Segments
          </Link>
        
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4 className="">
         <i className="fa-solid fa-coins"></i>Coin
          </h4>
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
         Mutual Funds
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
            National Pension Schema(NPS)
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
       Fixed Deposit
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Features on Coin
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          Payments and Orders
          </Link>
          <br />
          <Link to="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
          General
          </Link>
          <br />
        
        </div>
      </div>
    </div>

  );
}

export default CreateTicket;


