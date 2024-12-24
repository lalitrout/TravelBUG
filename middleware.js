const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js"); // Updated variable name for consistency
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    req.session.redirectUrl = req.originalUrl; // Save the original URL for redirection after login
    if (!req.isAuthenticated()) {
        req.flash("error", "You must log in first!");
        return res.redirect("/login");
    }
    next();
};
// 
// Middleware to save the redirect URL in local variable for logged-in users
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clear the session after saving it locally
    }
    next();
};


// Middleware to check if the user is the owner of a listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        if (!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this listing!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

// Middleware to validate a new or updated listing
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Middleware to validate a new or updated review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Middleware to check if the user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    try {
        let review = await Review.findById(reviewId);
        // if (!review) {
            // req.flash("error", "Review not found!");
            // return res.redirect(`/listings/${id}`);
        // }
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the author of this review!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};