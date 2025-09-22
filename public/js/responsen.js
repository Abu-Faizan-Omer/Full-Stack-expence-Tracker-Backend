console.log("New RESPOnse")
// Form submission handler
form.addEventListener("submit", async function(event) {
    try {
        event.preventDefault();

        const expence = event.target.expence.value;
        const description = event.target.description.value;
        const categories = event.target.cat.value;

        const expences = {
            expence: expence,
            description: description,
            categories: categories
        };

        const token=localStorage.getItem('token')
        const response = await axios.post("http://localhost:3000/expence/post", expences, {
            headers: { 'Authorization': token }
        });

        if (response.status === 200) {
            console.log("response-",response)
            alert(response.data.message);
            //showUserOnScreen(expences);
            showUserOnScreen(response.data.expense)
        }
    } catch (err) {
        console.error("Error during form submission:", err);
    }
})
function showUserOnScreen(expenses) {
    const ul = document.getElementById("listofitem");
    const li = document.createElement("li");
    li.textContent = `${expenses.expence}---${expenses.description}---${expenses.categories}`;

    const deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";

    deletebtn.addEventListener("click", async function() {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/expence/delete/${expenses._id}`,{headers: { 'Authorization': token }});
            li.remove();
        } catch (err) {
            console.error("Error in deleting:", err);
        }
    });

    li.appendChild(deletebtn);
    ul.appendChild(li);
}


//this is downloaded how to decode jwt token frontend for to check it is premium user or not
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function showPremiumUserMessage(){
        document.getElementById("rzp-button1").style.visibility="hidden"
         document.getElementById("message").innerHTML=`You are a Premium User`
}

//RazorPay
document.getElementById("rzp-button1").onclick=async function(e)
{
    const token=localStorage.getItem('token')
    const response=await axios.get("http://localhost:3000/purchase/premiummembership",{
        headers: { 'Authorization':token }
    })
    console.log('Response>>>after purchasepremiummembership>>> ',response)

    let options=
    {
        "key":response.data.key_id, 
        "order_id":response.data.order.id,
        "handler":async function(response){
            console.log("before update transanction token ",token)
            try{
                //after payment
            const updateResponse=await axios.post("http://localhost:3000/purchase/updateTransactionStatus",{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
            },{headers: { 'Authorization':token } })
            
            const newToken = updateResponse.data.token; // store new token
            localStorage.setItem('token', newToken); // update localStorage
            alert('You are a Premium User Now')

            //remove buy premium button when it is premium member
            document.getElementById("rzp-button1").style.visibility="hidden"
            document.getElementById("message").innerHTML=`You are a Premium User`
            //update now it is premium member
           // Re-check premium status using the new token
           const decodedToken = parseJwt(newToken);
           if (decodedToken.ispremiumuser) {
               showLeaderBoard();
           }
        }catch (err) {
            console.error("Error updating transaction:", err);
            alert('Something went wrong');
        }
        }
    }
    const rzpl=new Razorpay(options)
    rzpl.open();
    e.preventDefault()
     
    rzpl.on('Payment.failed',function(response){
        console.log(response)
        alert('Something went wrong')
    })
}

function showLeaderBoard(){
    const inputElement=document.createElement("input")
    inputElement.type="button"
    inputElement.value="Show Leaderboard"
    inputElement.onclick=async() =>{
        const token=localStorage.getItem("token")
        const userLeaderBoardArray=await axios.get("http://localhost:3000/premium/showLeaderBoard",{headers: { 'Authorization':token } })
        console.log("userLeaderBoardArray ",userLeaderBoardArray)

        let leaderboardElem=document.getElementById("leaderboard")
        leaderboardElem.innerHTML +="<h1> Show Leaderboard </h1>"
        console.log("userleaderBoardArray-- ",userLeaderBoardArray)
        userLeaderBoardArray.data.forEach((userdetails) =>{
            leaderboardElem.innerHTML +=`<li> Name - ${userdetails.name} Total Expence - ${userdetails.totalExpenses  || 0 }</li>`
        })
    }
    document.getElementById('message').appendChild(inputElement)
}


function download() {
    const token = localStorage.getItem('token');
    
    axios.get('http://localhost:3000/expence/download', { 
        headers: { "Authorization": token },
        responseType: 'blob' // Crucial for binary data
    })
    .then((response) => {
        // Create blob URL from response data
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'expenses.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    })
    .catch((err) => {
        console.error('Download error:', err);
        alert('Download failed: ' + (err.response?.data?.message || err.message));
    });
}

// Pagination-related variables
let currentPage = 1; // Start with page 1
let pageSize = localStorage.getItem("pageSize") || 10; // Default page size

// Fetch expenses with pagination
async function fetchExpenses() {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `http://localhost:3000/expence/get?page=${currentPage}&pageSize=${pageSize}`,
            { headers: { 'Authorization': token } }
        );

        // Clear existing expenses from the list
        document.getElementById("listofitem").innerHTML = "";

        // Show expenses
        response.data.expenses.forEach(expense => {
            showUserOnScreen(expense);
        });

        // Update pagination controls
        document.getElementById("current-page").textContent = `Page: ${response.data.currentPage}`;
        document.getElementById("prev-page").disabled = currentPage === 1;
        document.getElementById("next-page").disabled = currentPage === response.data.totalPages;
    } catch (err) {
        console.error("Error fetching expenses:", err);
    }
}

// Event listeners for pagination on page button
document.getElementById("prev-page").addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        fetchExpenses();
    }
});

document.getElementById("next-page").addEventListener("click", function () {
    currentPage++;
    fetchExpenses();
});

// Save page size preference to localStorage
document.getElementById("pageSize").addEventListener("change", function (e) {
    pageSize = parseInt(e.target.value);
    localStorage.setItem("pageSize", pageSize); // Store user preference
    currentPage = 1; // Reset to the first page
    fetchExpenses();
});

//logout
document.getElementById('logout-btn').addEventListener('click', function() {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to login page
    window.location.href = './login'; // Update with your actual login route
});


//   DOMContentLoaded
window.addEventListener("DOMContentLoaded", async function () {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    console.log("token while domcontenloaded",token)
    if (!token) {
        window.location.href = './login';
        return;
    }

    const decodeToken=parseJwt(token) //decoded token to knowits Premium useror Not
            console.log("decoded token--",decodeToken)
            const ispremiumuser=decodeToken.ispremiumuser
            if(ispremiumuser){
                showPremiumUserMessage()
                showLeaderBoard()
            }    

    document.getElementById("pageSize").value = pageSize;
    fetchExpenses();
});