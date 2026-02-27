import React from "react";
import { Link } from "react-router-dom";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6">
          <img src={imageURL} alt={`${productName} preview`} />
        </div>
        <div className="col-6 p-5 mt-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <div>
            <Link to={tryDemo}>Try Demo</Link>
            <Link to={learnMore} style={{ marginLeft: "50px" }}>
              Learn More
            </Link>
          </div>
          <div className="mt-3">
            <Link to={googlePlay}>
              <img src="/media-images/googlePlayBadge.svg" alt="Get it on Google Play" />
            </Link>
            <Link to={appStore}>
              <img
                src="/media-images/appstoreBadge.svg"
                alt="Download on the App Store"
                style={{ marginLeft: "50px" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;


