const axios = require('axios');
const qs = require('qs');

class FitbitService {
  static async getHeartRate(accessToken, date = 'today') {
    const response = await axios.get(
      `https://api.fitbit.com/1/user/-/activities/heart/date/${date}/1d.json`, 
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    return response.data;
  }
}
module.exports = FitbitService;