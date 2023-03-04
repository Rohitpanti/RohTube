// import { current } from "@reduxjs/toolkit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Comments = ({videoId}) => {

  const { currentUser } = useSelector((state)=>state.user)

    const [comments,SetComments]=useState([]);
    const [commentInput, setCommentInput] = useState("")

    useEffect(()=>{
      const fetchComments = async()=>{
        try{
          const res=await axios.get(`http://localhost:8800/api/comments/${videoId}`,{headers: {
      Authorization: 'Bearer '
    }},{withCredentials :true});
        SetComments(res.data);
        }catch(err){

        }
      };
      fetchComments();
    },[videoId])

    const handleComment = async(e) =>{
      e.preventDefault();
      window.location.reload();
      const headers = {
        "desc" : commentInput,
        videoId : videoId,
      }
      try {
        await axios.post(`http://localhost:8800/api/comments`, headers,{withCredentials : true})
      } catch (error) {
        console.log(error);
    }
  }


  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.img} />
        <Input placeholder="Add a comment..." onChange={e=>setCommentInput(e.target.value)}/>
        <Button onClick={handleComment}>Add</Button>
      </NewComment>
      {comments.map(comment => (
        <Comment key={comment._id} comment={comment}/>
      ) )}
    </Container>
  );
};

export default Comments;
