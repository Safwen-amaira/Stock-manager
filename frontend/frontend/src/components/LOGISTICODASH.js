import React, { useEffect, useRef } from 'react';
import './logistiko.css';

const LOGISTICODASH = () => {
  const BaseURL = 'https://app.logistiko.link/';
  const iframeRef = useRef(null);

  useEffect(() => {
    // Define the token. Make sure you replace this with the dynamic token fetching mechanism
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvY29yZS5sb2dpc3Rpa28ubGlua1wvYWRtaW5cL2xvZ2luIiwiaWF0IjoxNzI2NTk5NDgwLCJleHAiOjE3MjY3Njc0ODAsIm5iZiI6MTcyNjU5OTQ4MCwianRpIjoiWHJDV0hMWGdqZ21NbElXZCIsInN1YiI6MTIsInBydiI6ImRmODgzZGI5N2JkMDVlZjhmZjg1MDgyZDY4NmM0NWU4MzJlNTkzYTkifQ.Etvyr2pKXBYM9jmejMKCWUDwki3zk-yWfGe6NAzUqt8'; // Replace with your token logic

    // Set the token as a cookie for the iframe's domain
    document.cookie = `logistiko_token=${token}; path=/; domain=.logistiko.link; secure; SameSite=None`;

    // Listen for the iframe load and post a message to send the token or hide unnecessary UI
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', () => {
        iframeRef.current.contentWindow.postMessage(
          {
            action: 'setAuthToken', // Or whatever action the site expects
            token: token
          },
          '*'
        );
      });
    }
  }, []);

  return (
    <div style={{ height: '130vh', width: '100%' }}>
      <iframe
        ref={iframeRef}
        src={`${BaseURL}#/dashboard`}
        style={{ border: 'none', height: '100%', width: '100%' }}
        title="Logistiko Dashboard"
      />
    </div>
  );
};

export default LOGISTICODASH;
