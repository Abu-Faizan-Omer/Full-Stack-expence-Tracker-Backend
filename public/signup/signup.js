const form=document.getElementById("form")
form.addEventListener("submit",async(event)=>{
    try{
    event.preventDefault()
    const name=event.target.username.value
    const email=event.target.email.value
    const password=event.target.password.value

    const signupDetails={
        name:name,
        email:email,
        password:password
    }

    const response=await axios.post(`http://52.66.101.82:3000/users/signup`,signupDetails)
    if(response.status===201){
        window.location.href= "../login/login.html"
    }else{
        throw new Error("failed to login")
    }
    }catch(err){
        document.body.innerHTML +=`<div style="color:red;">${err}</div>`
    }    
})