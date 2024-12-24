const { query } = require("express");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');  // Correct import for geocoding
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route
module.exports.index = async (req, res, next) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
};

//new route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing =  async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate(
        {path: "reviews", populate:{path: "author",},}).populate("owner");
    if (!listing) {
        req.flash("error", "Your requested Listing does not EXIST!");
        return res.redirect("/listings");
    };
    res.render("listings/show.ejs" , {listing});
};

module.exports.createListing = async (req,res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedlisting = await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm =  async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Your requested Listing does not EXIST!");
        return res.redirect("/listings");
    };
    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs" , {listing , originalImageURL});
};

module.exports.updateListing =  async (req,res) => {
    let {id} = req.params;
    let updatedlisting = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (typeof req.file !== "undefined") {
       let url = req.file.path;
       let filename = req.file.filename;
       updatedlisting.image =  {url,filename};
       await updatedlisting.save();
    }
    req.flash("success", "Listing got updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Oopsie! Listing got deleted");
    res.redirect("/listings");
};