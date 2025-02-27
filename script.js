const API_KEY = "b49ac7dcea38409188f9a197885173b6";
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event)=>getNewsByCategory(event)))
let searchGroup = document.getElementById("search-group");
let searchToggle = false;
let url = new URL('https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr');

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

const getNews = async () => {
    try{
        const response = await fetch(url)
        const data = await response.json()
        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error("No matches for your search")
            }
            newsList = data.articles;
            console.log(newsList);
            render();
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
    getNews();
};

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
    );
    getNews();
}

const getNewsByKeyword = async () => {
    const keyword =document.getElementById("search-input");
    url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
    );
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

const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`
    document.getElementById("news-board").innerHTML = errorHTML;
}


getLatestNews();
