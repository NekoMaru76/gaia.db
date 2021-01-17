export default function PrivayPolicy() {
  if (!localStorage.getItem("privacy_policy")) {
    alert(`Privacy Policy

By using our site, you agree that GaiaDB may collect information about  you to be displayed publicly such as usernames. Please remember that this is a test system only. Do not use this if you are under 13.`);
    localStorage.setItem("privacy_policy", Date.now());
  }
}