const mongoose = require("mongoose");
const Listening = require("../modules/Listening.js");
const { Listingschema } = require("../schema.js");

module.exports.index = async (req, res) => {
  let alldata = await Listening.find({}); // Fixed: was 'List'
  res.render("listening/index.ejs", { alldata });
};

module.exports.create = async (req, res) => {
  res.render("listening/create.ejs");
};

module.exports.saveCreate = async (req, res, next) => {
  try {
    // Validate input data
    const { error } = Listingschema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(", ");
      req.flash("error", message);
      return res.redirect("/listing/new");
    }

    // Convert price to number
    if (req.body.listing.price) {
      req.body.listing.price = Number(req.body.listing.price);
    }

    const listening = new Listening(req.body.listing);
    listening.owner = req.user._id;

    // Handle file upload - use default image if no file uploaded or upload failed
    if (req.file && req.file.path && req.file.filename) {
      console.log("Image uploaded successfully:", req.file.filename);
      listening.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    } else {
      console.log("No file uploaded or upload failed, using default image");
      // Use the default image from schema if no file uploaded
      listening.image = {
        url: "https://images.unsplash.com/photo-1464069668014-99e9cd4abf16?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        filename: "default",
      };
    }

    await listening.save();
    req.flash("success", "New Listing Created");
    res.redirect("/alllist");
  } catch (error) {
    console.error("Error creating listing:", error);
    console.error("Cloudinary config check:", {
      cloud_name: process.env.CLOUD_NAME ? "Set" : "Missing",
      api_key: process.env.CLOUD_API_KEY ? "Set" : "Missing",
      api_secret: process.env.CLOUD_API_SECRET ? "Set" : "Missing",
    });
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listing/new");
  }
};

module.exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid listing ID");
      return res.redirect("/alllist");
    }

    let show = await Listening.findById(id)
      .populate({
        path: "review",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!show) {
      req.flash("error", "Listing not found");
      return res.redirect("/alllist");
    }

    res.render("listening/show.ejs", { show });
  } catch (error) {
    console.error("Error reading listing:", error);
    req.flash("error", "Failed to load listing");
    res.redirect("/alllist");
  }
};

// Line 93 - update method
module.exports.update = async (req, res) => {
    let { id } = req.params;
    let show = await Listening.findById(id);
    
    if (typeof req.file !== "undefined") {
        let filename = req.file.filename;
        let url = req.file.path;
        show.image = { url, filename };
        await show.save();
    }
    
    res.render("listening/Edit.ejs", { show });
};

// Lines 123, 133, 148, 156 - search method
module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    let alldata = [];
    let searchQuery = "";

    if (query && query.trim() !== "") {
      searchQuery = query.trim();

      // First, find exact matches (case-insensitive)
      const exactMatches = await Listening.find({
        // Changed from List
        $or: [
          { title: { $regex: new RegExp(`^${searchQuery}$`, "i") } },
          { location: { $regex: new RegExp(`^${searchQuery}$`, "i") } },
          { country: { $regex: new RegExp(`^${searchQuery}$`, "i") } },
        ],
      });

      // Then, find partial matches (excluding exact matches)
      const exactMatchIds = exactMatches.map((item) => item._id);
      const partialMatches = await Listening.find({
        // Changed from List
        _id: { $nin: exactMatchIds },
        $or: [
          { title: { $regex: new RegExp(searchQuery, "i") } },
          { description: { $regex: new RegExp(searchQuery, "i") } },
          { location: { $regex: new RegExp(searchQuery, "i") } },
          { country: { $regex: new RegExp(searchQuery, "i") } },
        ],
      });

      // Combine results: exact matches first, then partial matches
      alldata = [...exactMatches, ...partialMatches];
    } else {
      // If no search query, return all listings
      alldata = await Listening.find({}); // Changed from List
    }

    // Render the same index template with search results
    res.render("listening/index.ejs", {
      alldata,
      searchQuery,
      isSearchResult: query && query.trim() !== "",
      exactMatchCount:
        query && query.trim() !== ""
          ? await Listening.countDocuments({
              // Changed from List
              $or: [
                { title: { $regex: new RegExp(`^${query.trim()}$`, "i") } },
                { location: { $regex: new RegExp(`^${query.trim()}$`, "i") } },
                { country: { $regex: new RegExp(`^${query.trim()}$`, "i") } },
              ],
            })
          : 0,
    });
  } catch (error) {
    console.error("Search error:", error);
    req.flash("error", "An error occurred while searching");
    res.redirect("/alllist");
  }
};

// Line 183 - autoSuggestions method
module.exports.autoSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json([]);
    }

    const searchQuery = query.trim();

    // Get suggestions from titles, locations, and countries
    const suggestions = await Listening.aggregate([
      // Changed from List
      {
        $match: {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { location: { $regex: new RegExp(searchQuery, "i") } },
            { country: { $regex: new RegExp(searchQuery, "i") } },
          ],
        },
      },
      {
        $project: {
          suggestions: [
            { text: "$title", type: "title" },
            { text: "$location", type: "location" },
            { text: "$country", type: "country" },
          ],
        },
      },
      { $unwind: "$suggestions" },
      {
        $match: {
          "suggestions.text": { $regex: new RegExp(searchQuery, "i") },
        },
      },
      {
        $group: {
          _id: "$suggestions.text",
          type: { $first: "$suggestions.type" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 8 },
      {
        $project: {
          text: "$_id",
          type: 1,
          _id: 0,
        },
      },
    ]);

    res.json(suggestions);
  } catch (error) {
    console.error("Auto-suggestions error:", error);
    res.json([]);
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid listing ID");
      return res.redirect("/alllist");
    }

    const deletedListing = await Listening.findByIdAndDelete(id);

    if (!deletedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/alllist");
    }

    req.flash("success", "Listing deleted successfully");
    res.redirect("/alllist");
  } catch (error) {
    console.error("Error deleting listing:", error);
    req.flash("error", "Failed to delete listing. Please try again.");
    res.redirect("/alllist");
  }
};

module.exports.updatesave = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid listing ID");
      return res.redirect("/alllist");
    }

    // Extract listing data from request body
    const { title, description, price, location, country } = req.body.listing;

    // Prepare update data
    const updateData = {
      title,
      description,
      price: Number(price),
      location,
      country,
    };

    // Handle image upload if new image is provided
    if (req.file) {
      updateData.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Update the listing
    const updatedListing = await Listening.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/alllist");
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listing/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Failed to update listing");
    res.redirect("/alllist");
  }
};
