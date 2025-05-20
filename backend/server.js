
// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import {v2 as cloudinary} from 'cloudinary'; 
// dotenv.config();


// import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/user.routes.js'; 
// import postRoutes from './routes/post.routes.js';
// import connectMongoDb from './db/connectMongoDb.js';


//  cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,});
// const app=express();
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());


// app.use("/api/auth",authRoutes);
// app.use("/api/users",userRoutes);
// app.use("/api/posts",postRoutes);
 

// app.listen(8000,()=>{
//     console.log("server started on port 8000");
//     connectMongoDb();
// });

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors'; // <--- ADD THIS

dotenv.config();

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import connectMongoDb from './db/connectMongoDb.js';

// CORS config
const corsOptions = {
  origin: 'http://localhost:3000', // allow your frontend origin
  credentials: true, // allow credentials like cookies
};
const app = express();
app.use(cors(corsOptions)); // <--- ADD THIS

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(8000, () => {
  console.log('server started on port 8000');
  connectMongoDb();
});
