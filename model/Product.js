const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [1, "wrong min price"],
    max: [10000, "wrong max price"],
  },
  discountPercentage: {
    type: Number,
    min: [1, "wrong min discount"],
    max: [99, "wrong max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong max price"],
    default: 0,
  },
  stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  discountPrice: { type: Number},
  highlights:{ type : [String] },
  deleted: { type: Boolean, default: false },
},{timestamps:true});



productSchema.virtual("id").get(function () {
  return this._id;
});

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
exports.Product = mongoose.model("Product", productSchema);

// virtuals: true - This means that any virtual properties defined on the schema will be included in the JSON output.
// versionKey: false - This means that the _v property, which is used by Mongoose to track document versions, will be omitted from the JSON output.
// transform: function (doc, ret) { delete ret._id } - This is a custom function that modifies the JSON output before returning it. In this case, it deletes the _id property, which is the default primary key for MongoDB documents
