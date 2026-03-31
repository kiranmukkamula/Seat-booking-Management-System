const express=require('express')
const cors=require('cors')
const pool=require('./db')
const jwt=require('jsonwebtoken')
const app=express()

app.use(cors())
app.use(express.json())

//midleware
function authmiddleware(req,res,next)
{
    const token=req.headers.authorization.split(" ")[1]
    if(!token)
    {
        return res.json({message:"No token"})
    }
    try{
        const decoded=jwt.verify(token,"9347")
        req.user=decoded
        next()
    }
    catch(err)
    {
        res.json({message:"Invlaid"})
    }
}

app.post('/register',async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const result=await pool.query('SELECT * FROM users WHERE email=$1',[email])

        if(result.rows.length>0)  return res.json({message:"Email already exists"});
        if(password.length < 6)   return res.json({message:"Password should be min 6"})
        
        await pool.query('INSERT INTO users(name,email,password) VALUES($1,$2,$3)',[name,email,password])
        return res.json({message:"Sucessfully registered"});
    }
    catch(err)
    {
        return res.status(500).json(err.message)
    }
})

app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const res1=await pool.query('SELECT * FROM users WHERE email=$1',[email])
        if(res1.rows.length<=0) return res.json({message:"Email doesn't exists"})
        const user=res1.rows[0];
        if(password!==user.password) return res.json({message:"Invalid password"})
        
        const token=jwt.sign({id:user.id,email:user.email},"9347",{expiresIn:"1d"})
        res.json ({
                   message:"Login Successful",
                   token,
                   user
                })
    }
    catch(err)
    {
        res.json({message:err.message})
    }
});

app.get('/mybookings',authmiddleware,async(req,res)=>{
    const user_id=req.user.id;
    try{
       
        const result = await pool.query(
        `SELECT bookings.id, seats.seat_number, bookings.booking_date
         FROM bookings
         JOIN seats ON bookings.seat_id = seats.id
         WHERE bookings.user_id = $1`,
        [user_id]
        )   

        if(result.rows.length===0) return res.json({message:"No bookings"}) 
        
        res.json(result.rows)
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
    }
});

app.post('/cancel/:id',authmiddleware,async(req,res)=>{
    const booking_id=req.params.id
    const user_id=req.user.id
    try{
        const result=await pool.query(`DELETE FROM bookings WHERE id=$1 AND user_id=$2 RETURNING *`,[booking_id,user_id])
        if(result.rows.length==0)
        {
            return res.json({message:"No bookings found"})
        }
        res.json({message:"Booking cancelled"})
    }
    catch(err)
    {
        res.status(500).json({error:err.message});
    }
})

app.get('/seats/:date',async(req,res)=>{
    const date=req.params.date
    try{
        const result=await pool.query(`SELECT seats.seat_number,bookings.user_id FROM seats 
                                    LEFT JOIN bookings ON seats.id=bookings.seat_id AND bookings.booking_date=$1`,[date])
                    
        res.json(result.rows)
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
    }
})

app.get('/seats',async(req,res)=>{
    try{
        const result=await pool.query(`SELECT * FROM seats`)            
        res.json(result.rows)
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
    }
})




app.post('/book',authmiddleware,async(req,res)=>{
    const user_id=req.user.id;
    const {seat_id,booking_date}=req.body
    try{
        const result=await pool.query('SELECT * FROM bookings WHERE seat_id=$1 AND booking_date=$2',[seat_id,booking_date])
        if(result.rows.length>0) return res.json({message:"Seat already booked"})
        
        await pool.query("INSERT INTO bookings(user_id,seat_id,booking_date) VALUES($1,$2,$3)",[user_id,seat_id,booking_date])
        res.json({message:"seat Sucessfully booked"})
    }
    catch(err)
    {
        if(err.code==="23505")
        {
            res.json({message:"Seat already booked"})
        }
        res.status(500).json({message:err.message})
    }
})



app.listen(5000,()=>{
    console.log("Server running on: ",5000);
})