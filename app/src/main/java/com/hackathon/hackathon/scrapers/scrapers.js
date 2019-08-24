const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true })
const item ="SMEG"// process.argv.slice(2).join(" ");

const links = {
    BestBuy: "https://www.bestbuy.ca/en-ca",
    Lowes: "https://www.lowes.ca/search?tab=products-tab&query=",
    Amazon: "https://www.amazon.ca/"
}

async function getPrices(nightmare, item){
    let items =[];
    items = items.concat(await scrapeBestBuy(nightmare,item));
    items = items.concat(await scrapeLowes(nightmare,item));
    items = items.concat(await scrapeAmazon(nightmare,item));
    if(items.length>20)
        items = removeOutliers(items)
    console.log("Done?");
    return items;
}

async function scrapeBestBuy(nightmare,item){
    try{
    return await nightmare
        .goto(links.BestBuy)
        .type("[placeholder='Search Best Buy']", item)
        .click(".searchButton_T4-BG")
        .wait('.switchBar_1TT7s')
        .click('.switchBar_1TT7s')
        .wait(1000)
        .evaluate(()=>{
            window.scrollTo(0,document.body.scrollHeight);
            const source = "Best Buy";
            const names = ([].slice.call(document.querySelectorAll('.x-productListItem .productItemName_3IZ3c'))).map(item => item.innerText);
            const prices = ([].slice.call(document.querySelectorAll('.x-productListItem .price_FHDfG'))).map(item => parseFloat(item.innerText.slice(1).replace(/,/g,'')));
            const imgs = ([].slice.call(document.querySelectorAll(('.displayingImage_3xp0y .productItemImage_1en8J')))).map(img => img.src);
            let objArray = [];
            for(let i=0; i<prices.length; i++){
                objArray.push({
                    product_name: names[i],
                    product_price: prices[i],
                    product_img: imgs[i],
                    product_source: source
                })
            }
            return objArray;
        });
    }catch(e){
        console.log("Unable to get any results from Best Buy");
        return [];
    }
}

async function scrapeLowes(nightmare,item){
    try{
        return await nightmare
            .goto(links.Lowes+item.replace(/\s/g,"+")+"&display=24")
            .wait(1000)
            .evaluate(()=>{
                const source = "Lowe's";
                const imgs = ([].slice.call(document.querySelectorAll('.card.card-product .content-image a>img'))).map(img => img.src);
                const prices= ([].slice.call(document.querySelectorAll('.card.card-product .price-actual'))).map(item => parseFloat(item.innerText.slice(1).replace(/,/g,'')));
                const names= ([].slice.call(document.querySelectorAll('.card.card-product .d-block'))).map(item => item.innerText);
                let objArray = []
                for(let i=0; i<prices.length; i++){
                    objArray.push({
                        product_name: names[i],
                        product_price: prices[i],
                        product_img: imgs[i],
                        product_source: source
                    })
                }
                return objArray;
            })
        }catch(e){
            console.log("Unable to find anything from Lowe's");
            return [];
        }
}

async function scrapeAmazon(nightmare,item){
    try{
        return await nightmare
            .goto(links.Amazon)
            .wait(500)
            .type("#twotabsearchtextbox", item)
            .click(".nav-input")
            .wait(1000)
            .evaluate(()=>{
                const source = "Amazon";
                const imgs = ([].slice.call(document.querySelectorAll(".sg-col-inner>.s-include-content-margin .s-image-square-aspect>img"))).map(img => img.src);
                const prices= ([].slice.call(document.querySelectorAll(".sg-col-inner>.s-include-content-margin .a-offscreen"))).map(item => parseFloat(item.innerText.slice(5).replace(/,/g,'')));
                const names= ([].slice.call(document.querySelectorAll(".sg-col-inner>.s-include-content-margin .a-size-base-plus"))).map(item => item.innerText);
                let objArray = []
                for(let i=0; i<prices.length; i++){
                    objArray.push({
                        product_name: names[i],
                        product_price: prices[i],
                        product_img: imgs[i],
                        product_source: source
                    })
                }
                return objArray;
            })
        }catch(e){
            console.log("Unable to find anything from Amazon");
            return [];
        }
}

function removeOutliers(itemArray){
    let tempArray = itemArray;
    tempArray.sort((item1, item2) => item1.product_price - item2.product_price);
    const q1 = tempArray[Math.floor(tempArray.length/4)].product_price;
    const q3 = tempArray[Math.floor(3*tempArray.length/4)].product_price;
    const q2 = tempArray[Math.floor(tempArray.length/2)].product_price;
    const range = 0.5*(q3-q1);

    tempArray = tempArray.filter((item)=>{
        if(q2 * 1.2<item.product_price || q2*0.8 >item.product_price) 
            return false
        return true
    })
    return tempArray;
}

getPrices(nightmare, item)
    .then(result => console.log(result))
    .catch(error => console.error(error));