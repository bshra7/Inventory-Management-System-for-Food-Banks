

//function for search
function search() {

    let filter = document.getElementById('find').value.toUpperCase();

    let products = document.querySelectorAll('.productName');

    products.forEach(function(product) {

        let text = product.textContent || product.innerText;

        let card = product.closest('.list-group-item');

        if (text.toUpperCase().indexOf(filter) > -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}



const items =[
    {
        id : 1,
        title:"title1",
        location:'Moosejaw',
        category:"Canned Foods",
        expiryDate: "Within 1 Week",
        Organization:"Moosejaw Food Bank",
        hotItem: true,
    },

    {
        id: 2,
        title: "title2",
        location: "Regina",
        category: "Dairy",
        expiryDate: "Within 2 Weeks",
        Organization: "Regina Food Bank"
    },
]

const grid = document.querySelector('.list-group');

const renderItems = (arr) =>{
    grid.innerHTML= "";

    arr.forEach(item=> {
        grid.innerHTML += `
        <div class="list-group-item list-group-item-action" id = "${item.id}">
    <h5 class="productName">${item.title}</h5>
    <p class="mb-1">${item.location}</p>
    <p class="mb-1">${item.category}</p>
    <p class="mb-1">${item.expiryDate}</p>
    <p class="mb-1">${item.Organization}</p>
  </div>
        `
    })
}

renderItems(items);

//const filterSelect=document.querySelector("#category-dropdown")
const categoryFilter = document.querySelectorAll( //category filter
    "#category-dropdown .dropdown-item" 
);

categoryFilter.forEach(item => { item.addEventListener("click", (e) => {
        e.preventDefault(); // to stop page change

        const selectedCategory = e.target.textContent.trim();

        const FilterCat = items.filter(
            item => item.category === selectedCategory
        );

        renderItems(FilterCat);
    });
});

const locationFilter = document.querySelectorAll( //location filter
    "#location-dropdown .dropdown-item"
);
locationFilter.forEach(item => { item.addEventListener("click", (e) => {
        e.preventDefault(); // to stop page change

        const selectedLocation = e.target.textContent.trim();

        const FilterLocation = items.filter(
            item => item.location === selectedLocation
        );

        renderItems(FilterLocation);
    });
});

const expiryDateFilter = document.querySelectorAll( //location filter
    "#expiryDate-dropdown .dropdown-item"
);
expiryDateFilter.forEach(item => { item.addEventListener("click", (e) => {
        e.preventDefault(); // to stop page change

        const selectedExpiry = e.target.textContent.trim();

        const FilterExpiry = items.filter(
            item => item.expiryDate === selectedExpiry
        );

        renderItems(FilterExpiry);
    });
});


document.getElementById('addItemBtn').addEventListener('click', function () {

    const newItem = {
        id: Date.now(),
        title: document.getElementById("item-input").value,
        location: document.getElementById("location-input").value,
        category: document.getElementById("category-input").value,
        expiryDate: document.getElementById("expirydate-input").value,
        Organization: document.getElementById("organization-input").value
    };

 
    items.push(newItem);

    
    renderItems(items);
});

