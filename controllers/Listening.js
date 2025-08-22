const List = require("../modules/Listening.js");
const Listening = require('../modules/Listening.js');
const {Listingschema} = require("../schema.js");

module.exports.index = async(req , res)=>{
   let alldata = await List.find({});
   res.render("listening/index.ejs" , {alldata})

}

module.exports.create = async(req , res)=>{
  res.render("listening/create.ejs");
}

module.exports.saveCreate = async (req , res , next)=>{
  let url = req.file.path;
  let filename = req.file.filename;
  const listening = new Listening(req.body.listing);
  listening.owner = req.user._id;
  listening.image = {url , filename};
  await listening.save();
  req.flash("sucess" , "New Listing Created");
  res.redirect("/alllist");

}

module.exports.read = async (req , res)=>{
  let {id}= req.params;
  let show = await List.findById(id)
    .populate({
      path: 'review',
      populate: {
        path: 'author'
      }
    })
    .populate('owner');
  if(!show){
    req.flash("error" , "Listing not Found");
    res.redirect("/alllist");
  }
  res.render("listening/show.ejs", {show})
}

module.exports.update = async (req ,res)=>{
  let {id}= req.params;
  let show = await List.findById(id);
  res.render("listening/Edit.ejs" , {show});

}

module.exports.updatesave = async(req , res)=>{
  let {id} = req.params;
  await Listening.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listing/${id}`);

}

module.exports.destroy = async(req , res)=>{
  let {id} = req.params;
  let deletedList = await Listening.findByIdAndDelete(id);
  req.flash("sucess" , "Listing Deleted");
  res.redirect("/alllist")

}

module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    let alldata = [];
    let searchQuery = "";
    
    if (query && query.trim() !== "") {
      searchQuery = query.trim();
      
      // First, find exact matches (case-insensitive)
      const exactMatches = await List.find({
        $or: [
          { title: { $regex: new RegExp(`^${searchQuery}$`, 'i') } },
          { location: { $regex: new RegExp(`^${searchQuery}$`, 'i') } },
          { country: { $regex: new RegExp(`^${searchQuery}$`, 'i') } }
        ]
      });
      
      // Then, find partial matches (excluding exact matches)
      const exactMatchIds = exactMatches.map(item => item._id);
      const partialMatches = await List.find({
        _id: { $nin: exactMatchIds },
        $or: [
          { title: { $regex: new RegExp(searchQuery, 'i') } },
          { description: { $regex: new RegExp(searchQuery, 'i') } },
          { location: { $regex: new RegExp(searchQuery, 'i') } },
          { country: { $regex: new RegExp(searchQuery, 'i') } }
        ]
      });
      
      // Combine results: exact matches first, then partial matches
      alldata = [...exactMatches, ...partialMatches];
      
    } else {
      // If no search query, return all listings
      alldata = await List.find({});
    }
    
    // Render the same index template with search results
    res.render("listening/index.ejs", { 
      alldata, 
      searchQuery,
      isSearchResult: query && query.trim() !== "",
      exactMatchCount: query && query.trim() !== "" ? (await List.countDocuments({
        $or: [
          { title: { $regex: new RegExp(`^${query.trim()}$`, 'i') } },
          { location: { $regex: new RegExp(`^${query.trim()}$`, 'i') } },
          { country: { $regex: new RegExp(`^${query.trim()}$`, 'i') } }
        ]
      })) : 0
    });
    
  } catch (error) {
    console.error('Search error:', error);
    req.flash("error", "An error occurred while searching");
    res.redirect("/alllist");
  }
};

module.exports.autoSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }
    
    const searchQuery = query.trim();
    
    // Get suggestions from titles, locations, and countries
    const suggestions = await List.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: new RegExp(searchQuery, 'i') } },
            { location: { $regex: new RegExp(searchQuery, 'i') } },
            { country: { $regex: new RegExp(searchQuery, 'i') } }
          ]
        }
      },
      {
        $project: {
          suggestions: [
            { text: "$title", type: "title" },
            { text: "$location", type: "location" },
            { text: "$country", type: "country" }
          ]
        }
      },
      { $unwind: "$suggestions" },
      {
        $match: {
          "suggestions.text": { $regex: new RegExp(searchQuery, 'i') }
        }
      },
      {
        $group: {
          _id: "$suggestions.text",
          type: { $first: "$suggestions.type" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 8 },
      {
        $project: {
          text: "$_id",
          type: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(suggestions);
    
  } catch (error) {
    console.error('Auto-suggestions error:', error);
    res.json([]);
  }
};