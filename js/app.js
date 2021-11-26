// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close")
const searchBox = document.querySelector(".search");
const previous = document.querySelector(".modal-previous");
const next = document.querySelector(".modal-next");
let modalIndex = 0;


// fetch data from API
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)   //Passing control to the displayEmployees function, which will be created next
    .catch(err => console.log(err))



function displayEmployees(employeeData) {
    employees = employeeData; //setting employees variable equal to employeeData so that it can be accessed outside of this function
 
    // store the employee HTML as we create it
    let employeeHTML = '';

    // loop through each employee and create HTML markup and display index
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        // template literals make this so much cleaner!
        employeeHTML += `
    <div class="card" data-index="${index}">
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    </div>
    </div>
    `
    });
    gridContainer.innerHTML = employeeHTML;
}



function displayModal(index) {
    // use object destructuring make our template literal cleaner
    console.log(index);
    let { name, dob, phone, email, location: { city, street, state, postcode
    }, picture } = employees[index];

    let date = new Date(dob.date);

    const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    <hr />
    <p>${phone}</p>
    <p class="address">${street.number}, ${street.name}, ${state}, ${postcode}</p>
    <p>Birthday:
    ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    `;


    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
    modalIndex = index;

};

//Event Listeners
//gridContainers click event

gridContainer.addEventListener('click', e => {
    // make sure the click is not on the gridContainer itself
    if (e.target !== gridContainer) {

        // select the card element based on its proximity to actual element clicked
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');
        displayModal(index);
    }
});


//modalClose click event

modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
});



// Employees can be filtered by name


searchBox.addEventListener('input', runSearch);
// let searchResults =[];
// console.log(searchResults);

function runSearch(e) {
    
    const employeeNames = document.querySelectorAll(".name");
    let searchTerm = e.target.value.toLowerCase();
    // console.log(searchTerm);
    employeeNames.forEach(name => {
        if (name.textContent.toLowerCase().includes(searchTerm)) {
            name.parentElement.parentElement.removeAttribute("style");
        }
        else {
            name.parentElement.parentElement.style.display = "none";
        }
        // searchResults = searchTerm;
    })

}


//switch back and forth between employees when the detail modal window is open.

next.addEventListener('click', () => {
    if (typeof modalIndex === 'string') {
        modalIndex = parseInt(modalIndex, 10);
    }
    if (modalIndex === 11) {
        displayModal(0);
    } else {
        modalIndex++;
        displayModal(modalIndex);
    }
});

previous.addEventListener('click', () => {
    if (typeof modalIndex === 'string') {
        modalIndex = parseInt(modalIndex, 10);
    }
    if (modalIndex === 0) {
        displayModal(11);
    } else {
        modalIndex--;
        displayModal(modalIndex);
    }
});
