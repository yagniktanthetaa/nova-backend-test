const axios = require("axios");
const cardanoPolicy = require("../model/fingerprint.model");
const HTTP = require("../constant/response.constant");

const url =
  "https://cardano-mainnet.tangocrypto.com/d0b51e05f77b4c44bf231a11fd5fcb0a/v1/";

const config = {
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "905ef1fa397f4c9eb3e98accecbc946b",
  },
};

const blockForestOpt = {
  headers: {
    "Content-Type": "application/json",
    project_id: "mainnetQnnp1nFqUXuqISayzZSSSzbVW1Q4IZCC",
  },
};

const toHex = (str) => {
  var result = "";
  for (var i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

// getAssetsFromWalletTango&BlockForest
const getAssetsFromWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(200).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "Inavlid  request!",
        data: {},
      });
    }

    if (walletAddress.length !== 103) {
      return res.status(200).send({
        status: false,
        code: HTTP.NOT_ALLOWED,
        message: "Backend did not understand your request.",
        data: {},
      });
    }

    // Data Store
    let walletData = [];

    await axios
      .get(`${url}addresses/${walletAddress}/assets`, config)
      .then(async (response) => {
        await Promise.allSettled(
          response?.data?.data?.map(async (d, i) => {
            // await wait(i);

            try {
              const blockForestOpt = {
                headers: {
                  "Content-Type": "application/json",
                  project_id: "mainnetQnnp1nFqUXuqISayzZSSSzbVW1Q4IZCC",
                },
              };

              let assetName = toHex(d?.asset_name);
              let endpoint = `https://cardano-mainnet.blockfrost.io/api/v0/assets/${d?.policy_id}${assetName}`;
              await axios
                .get(endpoint, blockForestOpt)
                .then(async (res) => {
                  // console.log("🚀 ~ awaitaxios.get ~ res:", res?.data);
                  walletData.push(res?.data);

                  // walletData.push((oldArray) => [
                  //   ...new Set([...oldArray, res?.data]),
                  // ]);
                  // (oldArray) => [...new Set([...oldArray, res?.data])];
                })
                .catch((err) => {
                  console.log("🚀 ~ awaitaxios.get ~ err:", err);
                });

              // console.log("🚀 ~ unique?.map ~ response:", response.data);
              // return arr.push(response.data);
            } catch (error) {
              return;
            }
          })
        );

        // walletData.push(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
        return;
      });

    return res.status(200).send({
      status: false,
      code: HTTP.SUCCESS,
      message: "Success!",
      walletData,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
      data: {},
    });
  }
};

// getAssetsFromWalletBlockForest
const getAssetsFromWalletBlockForest = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(200).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "Inavlid  request!",
        data: {},
      });
    }

    if (walletAddress.length !== 103) {
      return res.status(200).send({
        status: false,
        code: HTTP.NOT_ALLOWED,
        message: "Backend did not understand your request.",
        data: {},
      });
    }

    // Data Store
    let walletData = [];

    await axios
      .get(`${url}addresses/${walletAddress}`, config)
      .then(async (response) => {
        try {
          const endPoint = `https://cardano-mainnet.blockfrost.io/api/v0/accounts/${response?.data?.stake_address}/addresses/assets`;

          await axios
            .get(endPoint, blockForestOpt)
            .then(async (res) => {
              await Promise.allSettled(
                res?.data?.map(async (d, i) => {
                  // await wait(i);
                  try {
                    let endpoint = `https://cardano-mainnet.blockfrost.io/api/v0/assets/${d?.unit}`;
                    await axios
                      .get(endpoint, blockForestOpt)
                      .then(async (res) => {
                        // console.log("🚀 ~ awaitaxios.get ~ res:", res?.data);
                        walletData.push(res?.data);
                      })
                      .catch((err) => {
                        console.log("🚀 ~ awaitaxios.get ~ err:", err);
                      });
                  } catch (error) {
                    return;
                  }
                })
              );
            })
            .catch((err) => {
              console.log("🚀 ~ axios.get ~ err:", err);
            });
        } catch (error) {
          console.log("🚀 ~ awaitPromise.allSettled ~ error:", error);
        }

        // walletData.push(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
        return;
      });

    return res.status(200).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "Success!",
      walletData,
      total: walletData.length,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "An unexpected response was received from the backend.",
      data: {},
    });
  }
};

// Export Module
module.exports = {
  getAssetsFromWallet,
  getAssetsFromWalletBlockForest,
};
