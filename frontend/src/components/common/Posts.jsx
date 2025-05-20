import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useEffect } from "react";

const Posts = ({feedType,username,userId}) => {


	const getPostEndpoint =()=>{
		switch (feedType) {
			case "forYou":
				return "http://localhost:8000/api/posts/all";
			case "following":
				return "http://localhost:8000/api/posts/all";
			case "posts":
				return `http://localhost:8000/api/posts/user/${username}`;
			case "likes":
				return  `http://localhost:8000/api/posts/likes/${userId}`;
			default:
				return "http://localhost:8000/api/posts/all";
		}
	}
	 const POST_ENDPOINT = getPostEndpoint();
	 const {data:posts,isLoading,refetch,isRefetching} = useQuery({
		queryKey: ["posts", feedType, username, userId],

		queryFn: async()=>{
			try {
				const res=await fetch(POST_ENDPOINT,{
					credentials: "include",
				});
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error || data.message || "Something went wrong");
				}
				
				return data;
			} catch (error) {
				throw new Error(error);
				
			}
		},
		retry: false,


	 });
	 useEffect(() => {
		refetch();
	}, [feedType]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;