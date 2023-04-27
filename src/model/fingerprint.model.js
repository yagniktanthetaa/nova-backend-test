const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const isCardanoSchema = new Schema({
  entities: [
    {
      policy_id: {
        type: String,
      },
      asset_name: {
        type: String,
        // unique: true,
      },
      fingerprint: {
        type: String,
        // unique: true,
      },
      quantity: {
        type: Number,
        // unique: true,
      },
      initial_mint_tx_hash: {
        type: String,
        // unique: true,
      },
    },
  ],
});

module.exports = mongoose.model("cardanoSchemaNFT", isCardanoSchema);
