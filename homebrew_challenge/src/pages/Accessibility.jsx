import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Accessibility = () => {
  return (
    <div fluid="true" className="accessibility-page">
      <h1>Accessibility</h1>
      <p className="px-5">
        We want everyone who visits the Covid-19 Dashboard to feel welcome, and
        able to find information whatever their circumstances.
      </p>
      <p className="px-5">To do this we've:</p>
      <ul>
        <li>
          Designed the dashboard to be accessible and usable for everyone.
        </li>
        <li>
          Provided alternative text and audio for media content where
          appropriate.
        </li>
      </ul>
      <hr />
      <h2>Confirmance statement</h2>
      <p className="px-5">
        We're working towards meeting the AA standard of the{" "}
        <a
          href="https://www.w3.org/TR/WCAG20/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web Content Accessibility Guidelines (WCAG) 2.0
        </a>
        .
      </p>

      <p className="px-5">
        Automated testing has taken place against these standards and all
        expectations are met under the directive.
      </p>
      <hr />
      <h2>Browsers</h2>
      <p className="px-5">
        We've tested the website using the following web browsers:
      </p>
      <ul className="browsers">
        <li>Google Chrome</li>
        <li>Mozilla Firefox</li>
        <li>Safari</li>
        <li>Microsoft Edge</li>
      </ul>
      <p className="px-5">
        We've tested the website using the following mobile browsers:
      </p>
      <ul className="browsers">
        <li>Google Chrome</li>
        <li>Mozilla Firefox</li>
        <li>Safari</li>
        <li>Samsung Browser</li>
      </ul>
      <hr />
      <h2>Screen Readers</h2>
      <p className="px-5">
        This website is compatible with modern screen readers and other
        assistive technologies.
      </p>
      <hr />
    </div>
  );
};

export default Accessibility;