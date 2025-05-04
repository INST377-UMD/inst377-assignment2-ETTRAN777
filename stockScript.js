const polygonKey = 'DTVV08SNiYi81pVITkhOA5XUOOJV3hv7';
const top5URL = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

const stockCommands = {
    'hello': () => alert('Hello'),
    'change the color to :color': (color) => {
        if(color === 'default'){
            document.body.style.backgroundColor = '#fddfbd';
        }
        document.body.style.backgroundColor = color;
    },
    'navigate to :page': (page) => {
        if(page.toLowerCase() === 'home'){
            page = 'index';
        }
        window.location.href = `${page.toLowerCase()}.html`;
    },
    'Look up *ticker': (ticker) => {
        ticker = ticker.trim().toUpperCase();
        console.log(`Looking up stock: ${ticker}`);
        lookupStock(ticker);
    },
};

function setListening(){
    document.getElementById("stop").style.border = "3px solid #1493f1";
}

window.onload = () => {
    if (annyang) {
        annyang.removeCommands(); // Clear previous commands
        annyang.addCommands(stockCommands); // Add new commands
    }
    getTop5StocksFromTradestie();
    setListening();
}
async function getTop5StocksFromTradestie() {
    try {
        const response = await fetch(top5URL);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const top5Stocks = data.slice(0, 5); // Assuming the API returns an array of stocks
        console.log(top5Stocks);

        // Update the table in stocks.html
        const tableBody = document.getElementById("stockTableBody");
        tableBody.innerHTML = ""; // Clear existing rows
        var image = ""
        top5Stocks.forEach(stock => {
            const row = document.createElement("tr");
            if (stock.sentiment == "Bullish") {
                image = 'https://cdn-icons-png.freepik.com/512/2207/2207180.png?ga=GA1.1.1602220827.1745967434'
            } else {
                image = 'https://cdn-icons-png.freepik.com/512/2207/2207175.png?ga=GA1.1.1602220827.1745967434'
            }
            row.innerHTML = `
                <td><a href="https://finance.yahoo.com/quote/${stock.ticker}">${stock.ticker}</a></td>
                <td>${stock.no_of_comments}</td>
                <td><img src="${image}" style="width:200px"></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to fetch top 5 stocks from Tradestie:', error);
    }
}

async function lookupStock(ticker) {
    var range = parseInt(document.getElementById("timeList").value.trim());
    // Get today's date
    var today = new Date();
    var fromDate = new Date();
    fromDate.setDate(today.getDate() - range);
    today = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    fromDate = fromDate.getFullYear() + '-' + String(fromDate.getMonth() + 1).padStart(2, '0') + '-' + String(fromDate.getDate()).padStart(2, '0');
    polygonUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${today}?adjusted=true&sort=asc&limit=120&apiKey=${polygonKey}`;    
    try {
        const response = await fetch(polygonUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        if(data.resultsCount == 0){
            alert("No data found for the given ticker. Please try again.");
            return false;
        }
        const ctx = document.getElementById('myChart').getContext('2d');
        closeChart();
        document.getElementById('chartDiv').style.display = 'block';
        ctx.chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: Array.isArray(data.results) ? data.results.map((point) => {
                    const date = new Date(point.t);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                }).filter(date => date >= fromDate && date <= today) : [],
                datasets: [{
                    label: `${ticker} Closing Prices`,
                    data: data.results
                        .filter(point => {
                            const date = new Date(point.t);
                            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            return formattedDate >= fromDate && formattedDate <= today;
                        })
                        .map((point) => point.c),
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Date"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Closing Price (USD)"
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Failed to fetch data from Polygon:', error);
    }
    return false;
}

async function polygonLookup(event) {
    event.preventDefault();
    var ticker = document.getElementById("stockInput").value.trim().toUpperCase();
    var range = parseInt(document.getElementById("timeList").value.trim());
    // Get today's date
    var today = new Date();
    var fromDate = new Date();
    fromDate.setDate(today.getDate() - range);
    today = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    fromDate = fromDate.getFullYear() + '-' + String(fromDate.getMonth() + 1).padStart(2, '0') + '-' + String(fromDate.getDate()).padStart(2, '0');
    console.log(today)
    console.log(fromDate);

    var polygonUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${today}?adjusted=true&sort=asc&limit=120&apiKey=${polygonKey}`;
    lookupStock(ticker);
}

function closeChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (ctx.chartInstance) {
        ctx.chartInstance.destroy();
        ctx.chartInstance = null;
    }
    document.getElementById('chartDiv').style.display = 'none';
}
