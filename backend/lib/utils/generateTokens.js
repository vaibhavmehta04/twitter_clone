// import jwt from 'jsonwebtoken';

// export const generateTokenAndSetCookie=(userId,res)=>{
//     const token = jwt.sign({userId},process.env.JWT_SECRET_KEY,{
//         expiresIn:"15d"
//     })
//     res.cookie("jwt",token,{
//         httpOnly:true,
//         secure: process.env.NODE_ENV !== "development",
//         sameSite:"none",
//         maxAge:15*24*60*60*1000, // 15 days
//     })



// }
import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // secure should be true in production
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // Use "lax" for local dev
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });
};
