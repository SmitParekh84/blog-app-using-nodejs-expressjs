const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();
const app = express()



// mongoose.connect('mongodb://localhost/blog', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })

// Connect to MongoDB using the connection string from the environment variable
mongoose.connect(process.env.MONGODB_CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
}).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((error) => {
    console.error('Connection failed: ' + error.message);
});

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static("public"));
// app.get('/', async(req, res) => {
//     const articles = await Article.find().sort({ createdAt: 'desc' })
//     res.render('articles/index', { articles: articles })
// })
app.get('/', async(req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/index', { articles: articles });
    } catch (error) {
        res.status(500).send('Error retrieving articles: ' + error.message);
    }
});
app.use('/articles', articleRouter)
    // module.exports = connectDB
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});