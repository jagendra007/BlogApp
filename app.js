//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { default: mongoose } = require('mongoose');

const app = express();

const port = 3000;

const homeStartingContent = "Introducing our cutting-edge Blog App, where creativity knows no bounds! Craft, publish, and share your thoughts seamlessly with a user-friendly interface, enriching your posts with media, and engaging with your readers through comments and discussions. Your content, instantly accessible across devices, fosters connections and sparks inspiration within a diverse community of creators. Whether you're a seasoned blogger or just starting, this platform is your canvas for self-expression. Join us and let your words shine bright, making your next blog post just a click away. Start sharing today and be a part of the storytelling revolution! #Blogging #ContentCreation #BlogApp 📝🌟";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// connecting with the mongodb database

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
     .then(async ()=>{
      console.log('Connected to MongoDB Atlas')
     })
    .catch(error=>{
      console.log('Error in Connecting to MongoDB Atlas', error)
    })

    // Schema Of the post
const Schema = mongoose.Schema;
const postSchema = new Schema({
  title :  String,
  content: String
})

 // Model of the post 

 const Post = mongoose.model('Post', postSchema);


// const posts = [];



app.get('/', async (req, res)=>{
  
  try{
 
     
   const posts = await Post.find({})
    res.render("home", {
      starting:homeStartingContent,
      posts:posts
   })
      
  

  }catch(error){
    console.log(error)
  }
  
})


app.get('/about', (req, res)=>{

  res.render("about",{aboutContent:aboutContent});

})




app.get('/contact', (req, res)=>{
  
    res.render("contact",{contact:contactContent});

})




app.get('/compose', (req, res)=>{
  
    res.render("compose");

})



app.get('/posts/:postId', async (req,res)=>{

  const postRequest =  req.params.postId;
  // console.log(postRequest);
  const getPost = await Post.findById(postRequest).exec();
 
  // console.log(getPost._id);
  if(getPost){
    console.log("Match Found!!!")
      res.render("post",{ 
        title:getPost.title,
        content:getPost.content,

  })
  }
})



app.post('/', (req,res)=>{
  res.redirect('/compose');
})


app.post("/delete/:postId", async (req, res) => {
  const postId =  req.params.postId;
//  console.log(req.headers); 
  try {

    const getPost = await Post.deleteOne({_id:postId}).exec();

res.redirect("/")
    // Implement your logic to delete the post by postId
    // Example: await Post.deleteOne({ postId });

    // res.redirect("/"); // Redirect to a page after successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.post('/compose', async(req,res)=>{
      const post =  new Post({
        title :  req.body.postTitle,
        content: req.body.postBody 
      })
      // posts.push(post);
      await post.save();
     res.redirect("/") 
})





app.listen(port, function() {
  console.log(`Server started on port  ${port}`);
});
