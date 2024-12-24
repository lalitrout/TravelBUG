const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.renderSignUpForm =  (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // Ensure response is sent only once
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // Check if the URL contains `_method=DELETE`
    const url = new URL(redirectUrl, `${req.protocol}://${req.get("host")}`); // Parse the URL
    const method = url.searchParams.get("_method");
    if (method && method.toUpperCase() === "DELETE") {
        // Redirect to another page if `_method=DELETE` is found
        return res.redirect(`/listings/${listing._id}`);
    }
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "You logged out!");
        res.redirect("/listings");
    });
};