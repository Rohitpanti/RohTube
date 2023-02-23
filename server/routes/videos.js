import express from 'express';
import { addVideo , updateVideo, deleteVideo, getVideo, addView, trendVideos, randVideos, subVideos , getByTag , getBySearch  } from '../controllers/video.js';
import { verifyToken } from '../verifyToken.js';

const router=express.Router();

//Create a Video and Adding video
router.post("/",verifyToken,addVideo)

//Updating a Video
router.put("/:id",verifyToken,updateVideo)

//Deleting a Video
router.delete("/:id",verifyToken,deleteVideo)

//Getting a Video
router.get("/find/:id",getVideo)

router.put("/view/:id",addView)

//Getting Trending Video
router.get("/trend",trendVideos)

//Getting Rabdom Videos
router.get("/random",randVideos)

//Getting Videos of  subscribed Channels
router.get("/sub",verifyToken,subVideos)

//Getting videos from Tags
router.get("/tags",getByTag)

//getting videos from search(titles)
router.get("/search",getBySearch)


export default router;