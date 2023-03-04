import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text}
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Button = styled.button`
  padding: 2px 10px;
  background-color: transparent;
  border: 1px solid #cc1a00;
  color:#cc1a00;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 30rem;
`;

const Comment = ({comment}) => {
  const [channel,setChannel]=useState({})

  useEffect(  ()=>{
    const fetchComment = async ()=>{
      const res=await axios.get(`http://localhost:8800/api/users/find/${comment.userId}`,{headers: {
        Authorization: 'Bearer '
      }},{withCredentials : true});
        const {password, ...others} = res.data;
        setChannel(res.data)
    }
    fetchComment();
  },[comment.userId])

  const handleDeletecomment = async(e) => {
    e.preventDefault();
    window.location.reload();// its not ideal to do but due to time scarcity i had too trying to make this with redux
    try {
      await axios.delete(`http://localhost:8800/api/comments/${comment._id}`,{headers: {Authorization: 'Bearer'},withCredentials : true})
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name} <Date>1 day ago</Date>
        </Name>
        <Text>
          {comment.desc}
        </Text>
      </Details>
      <Button onClick={handleDeletecomment}>Delete</Button>
    </Container>
  );
};

export default Comment;
