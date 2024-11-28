const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const User= require("../models/user"); // Update based on your Sequelize models
const forgotpasswordm=require("../models/forgotpasswordm")

exports.forgotpassword = async (req, res, next) => {
    const { email } = req.body;

    // Check if email exists in the request body
    if (!email) {
        return res.status(400).json({ message: "Email not provided" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up as a new user." });
        }

        // Generate unique request ID
        const requestId = uuidv4();

        // Save request in ForgotPassword table
        await forgotpasswordm.create({
            id: requestId,
            userId: user.id,
            isActive: true,
        });

        // Initialize SendInBlue API client
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.SIB_API_KEY; // Ensure your `.env` file contains SIB_API_KEY

        const transEmailApi = new Sib.TransactionalEmailsApi();

        // Configure sender and receiver
        const sender = {
            email: "abufaizan1997@gmail.com", // Replace with your email
            name: "Expense Tracker Team", // Replace with your name or app name
        };
        const receivers = [
            {
                email:email, // Send email to the user who requested password reset
            },
        ];

        // Send transactional email
        const emailResponse = await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Reset Your Password - Expense Tracker",
            htmlContent: `
                <p>Hi ${user.name},</p>
                <p>We received a request to reset your password. Please use the link below to reset it:</p>
                <p><a href="http://your-frontend-url.com/reset-password/${requestId}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thanks,<br/>The Expense Tracker Team</p>
            `,
        });

        console.log("Email sent successfully:", emailResponse);
        res.status(200).json({ message: "Password reset email sent successfully!" });

    } catch (err) {
        console.error("Error in forgotpassword:", err);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};

exports.checkresetpassword =async (req,res,next)=>{
    const uid=req.params.uuid;
    
     const uuid= await forgotpasswordm.findByPk(uid,{
         attributes:[
             'id','isActive'
         ]
     });
     
     // Check if the UUID exists and is active
     if (!uuid || !uuid.isActive) {
         return res.status(400).json({ message: "Invalid or expired reset link" });
     }
 
     // Render your password reset form
     res.send(`
       <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Reset Password</title>
 </head>
 <body>
     <div class="container">
         <h2>Reset Password</h2>
         <form action="/password/resetpassword/${uid}" method="POST">
             <input type="password" name="newPassword" placeholder="New Password" required />
             <button type="submit">Reset Password</button>
         </form>
     </div>
 </body>
 </html>
 
     `);
 }

 exports.finalresetpassword= async (req,res,next)=>{
    const t = await sequalize.transaction();
    const { uuid } = req.params; 
    const { newPassword } = req.body; 

    

    if (!newPassword) {
        return res.status(400).json({ message: 'Password is required' });
    }
 
    

    try {
       
        const resetRequest = await forgotpasswordm.findOne({ where: { id: uuid, isActive: true } },{transaction: t });

        if (!resetRequest) {
            return res.status(400).json({ message: "Invalid or expired reset link" });
        }

      
         // Hash the new password using bcrypt
         const saltRounds = 10;  // Set the number of salt rounds for bcrypt
         const hashedPassword = await bcrypt.hash(newPassword, saltRounds);  // Hash the password
 
         // Update the user's password in the Users table
         await User.update(
             { password: hashedPassword },
             { where: { id: resetRequest.userId } },{transaction: t}
         );
       
        await forgotpasswordm.update(
            { isActive: false },
            { where: { id: uuid } },{transaction:t}
        );

        await t.commit();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Error occurred while resetting password", error: error.message });
    }
};