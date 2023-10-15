interface Comment{
    id?:string,
    username?:string,
    createdAt?:string,
    body?:string
}

interface Like{
    username?:string
}

interface Post {
    id:string,
    username:string,
    body:string,
    commentCount:number,
    comments:Comment[],
    createdAt:string,
    likeCount:number,
    likes:Like[]

}

interface LikePostProps {
    id:string,
    likeCount:number,
    likes:Like[]
}

interface DeletePostProps{
    id:string
}

interface CommentPostProps{
    postId:string,
}