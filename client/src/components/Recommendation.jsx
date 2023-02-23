import axios from 'axios';
import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import Card from './Card';

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({tags}) => {
    const [videos,setVideos]= useState([]);

    useEffect(() => {
    const fetchVideos = async () =>{
        const res=await axios.get(`http://localhost:8800/api/videos/tags?tags=${tags}`,{headers: {Authorization: 'Bearer '}},{withCredentials :true});
        setVideos(res.data);
    };
    fetchVideos();
    }, [tags])
    
  return (
    <Container>
        {videos.map((video)=>{
            return <Card  type="sm" key={video._id} video={video}/>
        })}
    </Container>
  )
}

export default Recommendation