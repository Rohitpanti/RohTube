import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
//import Card from "../components/Card";
import { useDispatch } from "react-redux";
import {useSelector} from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { fetchStart, fetchSuccess } from "../redux/videoSlice";
import moment from "moment";
import { ThumbDown } from "@mui/icons-material";
import { ThumbUp } from "@mui/icons-material";
import { like,dislike } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";


const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height:720px;
  width:100%;
  object-fit:cover;
`;

const Video = () => {
  const {currentUser} = useSelector((state)=>state.user);
  const {currentVideo} = useSelector((state)=>state.video);
  const [sharedtext, setSharedtext] = useState('Share');
  const dispatch =useDispatch();

  const path=useLocation().pathname.split("/")[2]

  const [channel,setChannel]=useState({})

  useEffect(()=>{
    dispatch(fetchStart());
    const fetchData = async() =>{
      try {
        const videoRes=await axios.get(`http://localhost:8800/api/videos/find/${path}`,{withCredentials : true});
        const channelRes=await axios.get(`http://localhost:8800/api/users/find/${videoRes.data.userId}`,{withCredentials : true});
        const {password, ...others} = channelRes.data;
        setChannel(others)
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        
      }
    }
    fetchData()
  },[path,dispatch]) 

  const handleLike = async()=>{
    await axios.put(`http://localhost:8800/api/users/like/${currentVideo._id}`,{headers: {
      Authorization: 'Bearer '
    }},{withCredentials :true});
    dispatch(like(currentUser._id))
  }


  const handleDisLike = async()=>{
    await axios.put(`http://localhost:8800/api/users/dislike/${currentVideo._id}`,{headers: {
      Authorization: 'Bearer '
    }},{withCredentials :true});
    dispatch(dislike(currentUser._id))
  }

  const handleSubscription =async ()=>{
    currentUser.subscribedUsers.includes(channel._id)?
    await axios.put(`http://localhost:8800/api/users/unsub/${channel._id}`,{headers: {
      Authorization: 'Bearer '
    }},{withCredentials :true}) 
    :
    await axios.put(`http://localhost:8800/api/users/sub/${channel._id}`,{headers: {
      Authorization: 'Bearer '
    }},{withCredentials :true});
    dispatch(subscription(channel._id))
  }

  const handleShare = ()=>{
    setSharedtext("Copied");
    const sharedtext=window.location.href;
    navigator.clipboard.writeText(sharedtext);
    setTimeout(() => {
      setSharedtext("Share");
    },2000);
  }


  return (
    <Container>
      <Content>
        <VideoWrapper>
        <VideoFrame src={currentVideo?.videoUrl} controls/>
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info> {currentVideo?.views} views • {moment(currentVideo?.createdAt).fromNow()}</Info>
          <Buttons>
          <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser._id) ? (<ThumbUp />) : (<ThumbUpOutlinedIcon />)}{" "}{currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDisLike}>
              {currentVideo.dislikes?.includes(currentUser._id) ? (<ThumbDown />) : (<ThumbDownOffAltOutlinedIcon />)} {" "} {currentVideo.dislikes?.length}
              </Button>
            <Button>
              <ReplyOutlinedIcon onClick={handleShare}/> {sharedtext}
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers}</ChannelCounter>
              <Description>
                {currentVideo?.desc}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSubscription}>{currentUser?.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED":"SUBSCRIBE"}</Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id}/>
      </Content>
      <Recommendation tags={currentVideo.tags}/>
    </Container>
  );
};

export default Video;
