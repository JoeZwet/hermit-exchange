let json = null;

function getPricesJson() {
    const jsonUrl = "https://raw.githubusercontent.com/JoeZwet/hermit-exchange/master/data/prices.json";
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            json = JSON.parse(xmlHttp.responseText);
            display(json);
        }
    };
    xmlHttp.open("GET", jsonUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function parseIcon(icon) {
    let parts = icon.split("#");
    return `assets/${parts[0]}s/${parts[1]}.png`
}

function display(json) {
    console.log(json);
    for (let j in json) {
        document.getElementById("prices-body").appendChild(createItem(json[j]));
    }
    document.getElementById('progress').hidden = true;
    document.getElementsByTagName("form")[0].hidden = false;
    document.getElementById('price-table').hidden = false;
}

function filter() {
    let text = document.getElementById("search").value;
    document.getElementById('prices-body').innerHTML = "";
    for (let j in json) {

        if((json[j]['selling']['item'].toUpperCase()).includes(text.toUpperCase())) {
            document.getElementById("prices-body").appendChild(createItem(json[j]));
        } else {
            for(let h in json[j]['by']) {
                let hermit = json[j]['by'][h];
                if(hermit.name.toUpperCase().includes(text.toUpperCase())) {
                    document.getElementById("prices-body").appendChild(createItem(json[j]));
                    break;
                }
            }
        }
    }
}

function createItem(j) {
    let row = document.createElement("tr");
    let selling = document.createElement("td");
    let price = document.createElement("td");
    let by = document.createElement("td");

    let sellingItem = document.createElement("img");
    let priceItem = document.createElement("img");

    selling.className = "mdl-data-table__cell--non-numeric";
    price.className = "mdl-data-table__cell--non-numeric";
    by.className = "mdl-data-table__cell--non-numeric";

    sellingItem.src = parseIcon(j['selling']['icon']);
    sellingItem.width = 16;
    sellingItem.height = 16;
    priceItem.src = parseIcon(j['price']['icon']);
    priceItem.width = 16;
    priceItem.height = 16;

    selling.appendChild(sellingItem);
    selling.appendChild(document.createTextNode(` ${j['selling']['item']} x${j['selling']['count']}`));
    price.appendChild(priceItem);
    price.appendChild(document.createTextNode(` ${j['price']['item']} x${j['price']['count']}`));

    for(let h in j.by) {
        let hermit = j.by[h];
        let face = document.createElement("img");
        face.src = `https://crafatar.com/avatars/${hermit.uuid}?size=30&default=MHF_Steve&overlay`;
        face.width = 30;
        face.height = 30;

        let name = document.createTextNode(` ${hermit.name} `);

        by.appendChild(face);
        by.appendChild(name);
    }

    row.appendChild(selling);
    row.appendChild(price);
    row.appendChild(by);
    return row;
}

window.addEventListener('load',
    function() {
        getPricesJson();
    }, false);

document.getElementById('search').addEventListener('input',
    function () {
        filter();
    }, false);
