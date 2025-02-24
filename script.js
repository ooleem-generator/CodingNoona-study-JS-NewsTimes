const API_KEY = "b49ac7dcea38409188f9a197885173b6";
let newsList = [];
const getLatestNews = async () => {
    const url = new URL(
        // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
        'https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr'
    );
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles;
    render();
};

const render = () => {
    const newsHTML = newsList.map(news=>`            <div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src="${news.urlToImage}">
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>${news.description}</p>
                    <div>${news.source.name} * ${news.publishedAt}</div>
                </div>
            </div>`
        ).join("");

    document.getElementById("news-board").innerHTML = newsHTML;
}

getLatestNews();
