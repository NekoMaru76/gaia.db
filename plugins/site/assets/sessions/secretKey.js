export default async function secretKey(callback, url) {
  let secret = sessionStorage.getItem("secret");
  
  if (!secret) {
    secret = prompt(`Secret Key?`);

    fetch(`/isValidSecretKey`, {
      body: JSON.stringify({ secretKey: secret }),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.code !== 200) {
          alert(`Invalid secret key. Please reload this page!`);
          window.stop();
        } else {
          fetch(url).then(res => {
            res.text().then(t => {
              document.body.innerHTML += t;
              callback(secret);
            });
          });
          sessionStorage.setItem("secret", secret);
        }
      });
  } else {
    fetch(url).then(res => {
      res.text().then(t => {
        document.body.innerHTML += t;
        callback(secret);
      });
    });
  }
}
