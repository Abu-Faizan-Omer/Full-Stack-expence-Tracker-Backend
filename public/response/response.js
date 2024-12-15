// Ensure token is globally available
const token = localStorage.getItem('token');
//console.log("Token from localStorage:", token); // Debug line to ensure token is present

// Check if token is found before proceeding
if (!token) {
    console.error("No token found in localStorage. Authorization will fail.");
}

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
        const response = await axios.post("http://52.66.101.82:3000/expence/post", expences, {
            headers: { 'Authorization': token }
        });

        if (response.status === 201) {
            alert(response.data.message);
            showUserOnScreen(expences);
            //showUserOnScreen(response.data.expenceamount)
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
            await axios.delete(`http://52.66.101.82:3000/expence/delete/${expenses.id}`,{headers: { 'Authorization': token }});
            li.remove();
        } catch (err) {
            console.error("Error in deleting:", err);
        }
    });

    li.appendChild(deletebtn);
    ul.appendChild(li);
}

function showPremiumUserMessage(){
        document.getElementById("rzp-button1").style.visibility="hidden"
         document.getElementById("message").innerHTML=`You are a Premium User`
}
//this is downloaded how to decode jwt token frontend
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Display expenses on page load
window.addEventListener("DOMContentLoaded", async function () {
    try {
        if (token) {
            //const token=localStorage.getItem('token')
            const decodeToken=parseJwt(token)
            console.log(decodeToken)
            const ispremiumuser=decodeToken.ispremiumuser
            if(ispremiumuser){
                showPremiumUserMessage()
                showLeaderBoard()
            }

            const response = await axios.get("http://52.66.101.82:3000/expence/get", {
                headers: { 'Authorization':token }
            });
            const expenses = response.data;
            const totalExpense = response.data.totalExpense;

            expenses.forEach(expense => {

                // addNewExpense(expense);
                // addNewExpensetoUI(expense);

                showUserOnScreen(expense);

            });
        } else {
            console.log("Token not found in localStorage");
        }
    } catch (err) {
        console.error("Error loading expenses:", err);
    }
});

//
document.getElementById("rzp-button1").onclick=async function(e)
{
    const token=localStorage.getItem('token')
    const response=await axios.get("http://52.66.101.82:3000/purchase/premiummembership",{
        headers: { 'Authorization':token }
    })
    console.log(response)
    let options=
    {
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response){
            await axios.post("http://52.66.101.82:3000/purchase/updateTransactionStatus",{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
            },{headers: { 'Authorization':token } })

            alert('You are a Premium User Now')

            //remove button
            document.getElementById("rzp-button1").style.visibility="hidden"
            document.getElementById("message").innerHTML=`You are a Premium User`

            localStorage.setItem('token',response.data.token)
            showLeaderBoard()
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
        const userLeaderBoardArray=await axios.get("http://52.66.101.82:3000/premium/showLeaderBoard",{headers: { 'Authorization':token } })
        console.log(userLeaderBoardArray)

        let leaderboardElem=document.getElementById("leaderboard")
        leaderboardElem.innerHTML +="<h1> Show Leaderboard </h1>"
        userLeaderBoardArray.data.forEach((userdetails) =>{
            leaderboardElem.innerHTML +=`<li> Name - ${userdetails.name} Total Expence - ${userdetails.totalExpenses  ||0 }</li>`
        })
    }
    document.getElementById('message').appendChild(inputElement)
}

function download(){
    axios.get('http://52.66.101.82:3000/expence/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 200){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }
    })
    .catch((err) => {
        console.log(err)
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
            `http://52.66.101.82:3000/expence/get?page=${currentPage}&pageSize=${pageSize}`,
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

// Event listeners for pagination
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

// Load expenses on page load
window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("pageSize").value = pageSize; // Set pageSize dropdown to saved value
    fetchExpenses();
});
