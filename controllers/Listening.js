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