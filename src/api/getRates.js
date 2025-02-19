const axios = require("axios");

export const getRates = async (pair) => {
  try {
    const data = await axios.get(
      `https://garantex.org/api/v2/depth?market=${pair}`
    );

    if (data.status == 200) {
      if (data.data && data.data.asks && data.data.bids) {
        return {
          info: {
            bid: +data.data.asks[0].price,
            ask: +data.data.bids[0].price,
          },
        };
      }
    } else {
      return {
        error: true,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      error: true,
    };
  }
};
