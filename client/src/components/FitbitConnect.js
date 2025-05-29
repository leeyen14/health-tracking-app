// client/src/components/FitbitConnect.js
import { useAuth } from '../context/AuthContext';

export default function FitbitConnect() {
  const { user } = useAuth();

  const connectFitbit = () => {
    const clientId = process.env.REACT_APP_FITBIT_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/fitbit-callback`);
    window.location.href = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=activity%20heartrate%20sleep`;
  };

  return <button onClick={connectFitbit}>Connect Fitbit</button>;
}