async function login(event) {
    event.preventDefault();
    try {
        const loginDetails = {
            email: event.target.email.value,
            password: event.target.password.value
        };
        const response = await axios.post(`http://65.0.178.153:3000/users/login`, loginDetails);
        
        if (response.status === 200) {
            alert(response.data.message);
            localStorage.setItem('token',response.data.token)
             window.location.href= "../response/response.html"
        }
    } catch (err) {
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">${err.response ? err.response.data.message : 'Login failed'}</div>`;
    }
}

function forgotpassword() {
    window.location.href = "../ForgotPassword/forgot.html"
}