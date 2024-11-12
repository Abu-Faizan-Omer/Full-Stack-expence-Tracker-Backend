const form=document.getElementById("form")
form.addEventListener("submit",(event)=>{
    event.preventDefault()
    const name=event.target.username.value
    const email=event.target.email.value
    const password=event.target.password.value

    const obj={
        name:name,
        email:email,
        password:password
    }
    axios.post(`http://localhost:3000/users/signup`,obj)
    .then(response =>{
        console.log(response.data)
    } )
    .catch(err =>{
        console.log(err)
    })
})