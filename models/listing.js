const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
    type: String,
    enum: ['Trending', 'Rooms', 'Castles', 'Bed & Breakfast', 'Treehouses', 'Luxe', 'Beachfront', 'Boats', 'Camping'],
    default: 'Trending'
   },

});

listingSchema.index({ title: 'text', description: 'text', location: 'text' });

// Middleware for deleting associated reviews
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
