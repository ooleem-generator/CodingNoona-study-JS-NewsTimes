const API_KEY = "b49ac7dcea38409188f9a197885173b6";
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event)=>getNewsByCategory(event)))
let searchGroup = document.getElementById("search-group");
let searchToggle = false;
let searchButton = document.getElementById("search-button");
let searchInput = document.getElementById("search-input");
let url = new URL('https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr');
let totalResults = 0;
let page = 1;
const pageSize = 7;
const groupSize = 5;

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

const toggleSearch = () => {
    searchToggle = !searchToggle;
    if (searchToggle === true) {
      searchGroup.style.display = "flex";
    } else {
      searchGroup.style.display = "none";
    }
    console.log(searchGroup);
  };

const keywordNullCheck = () => {
    if (searchInput.value){
        searchButton.disabled = false;
    } else {
        searchButton.disabled = true;
    }
}


const getNews = async () => {
    try{
        url.searchParams.set("page", page) // &page=page
        url.searchParams.set("pageSize", pageSize)

        const response = await fetch(url)
        const data = await response.json()
        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error("No matches for your search")
            }
            newsList = data.articles;
            totalResults = data.totalResults;
            console.log(totalResults);
            render();
            paginationRender();

        } else {
            throw new Error(data.message)
        }

    }catch (error) {
        errorRender(error.message);
    }
}

const getLatestNews = async () => {
    url = new URL(
        // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
        'https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr'
    );
    page = 1;
    getNews();
};

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
    );
    page = 1;
    getNews();
}

const getNewsByKeyword = async () => {
    const keyword =searchInput.value;
    url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
    );
    page = 1;
    console.log(keyword)
    getNews();
}

const render = () => {
    const newsHTML = newsList.map(news=>`            <div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src="${news.urlToImage}" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';">
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>${news.description == null | news.description == "" ? "내용 없음" : news.description.length > 200 ? news.description.substring(200) + "..." : news.description}</p>
                    <div>${news.source.name ? news.source.name : "no source"} * ${moment(news.publishedAt.substr(0,10), "YYYY-MM-DD").fromNow()}</div>
                </div>
            </div>`
        ).join("");

    document.getElementById("news-board").innerHTML = newsHTML;
    console.log(newsList)
}

const paginationRender = () => {
    const totalPages = Math.ceil(totalResults / pageSize);
    const pageGroup = Math.ceil(page / groupSize);
    let lastPage = pageGroup * groupSize;
    if (lastPage > totalPages) {
        lastPage = totalPages;
    }
    const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
    let paginationHTML = `<li class="page-item" ${page===1?"style='display:none'" : ""}><a class="page-link" onclick="moveToPage(${1})">&laquo;</a></li>`;
    paginationHTML += `<li class="page-item" ${page===1?"style='display:none'" : ""}><a class="page-link" onclick="moveToPage(${page-1})">&lt;</a></li>`;

    for (let i=firstPage; i<=lastPage; i++) {
        paginationHTML += `<li class="page-item ${i===page?"active" : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
    }

    paginationHTML += `<li class="page-item" ${page===totalPages?"style='display:none'" : ""}><a class="page-link" onclick="moveToPage(${page+1})">&gt;</a></li>`
    paginationHTML += `<li class="page-item" ${page===totalPages?"style='display:none'" : ""}><a class="page-link" onclick="moveToPage(${totalPages})">&raquo;</a></li>`
    document.querySelector(".pagination").innerHTML = paginationHTML;
}

const moveToPage = (pageNum) => {
    page = pageNum;
    getNews();
}


const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`
    document.getElementById("news-board").innerHTML = errorHTML;
}

searchInput.addEventListener("keyup", function(event){
    if (event.key === "Enter" && searchInput.value !== ''){
        getNewsByKeyword();
    }
})

searchInput.addEventListener("keyup", keywordNullCheck)

getLatestNews();


