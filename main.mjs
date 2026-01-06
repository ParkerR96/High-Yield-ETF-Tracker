'use strict';
import dotenv from 'dotenv'
import request from 'request'
import fetch from 'node-fetch'
import puppeteer from 'puppeteer'
import fs from 'fs'
import * as cheerio from 'cheerio'              
const api = process.env.APIKEY

var parkerStocks = {
  ULTY: {
      amount: 0.00000,
      currentDividend: 0.0
      },
  YMAG: {
    amount: 0.00000,
    currentDividend: 0.0
  },
  YMAX: {
      amount: 0.00000,
      currentDividend: 0.0
      },
  LFGY: {
    amount: 0.00000,
    currentDividend: 0.0
  },
  CHPY: {
      amount: 0.00000,
      currentDividend: 0.0
      },
  GPTY: {
    amount: 0.00000,
    currentDividend: 0.0
  },
  QDTY: {
      amount: 0.00000,
      currentDividend: 0.0
      },
  RDTY: {
    amount: 0.00000,
    currentDividend: 0.0
  },
  SDTY: {
      amount: 0.00000,
      currentDividend: 0.0
      },
  SLTY: {
    amount: 0.00000,
    currentDividend: 0.0
  },
};
  

var stocks = {
  ULTY: { name: 'ULTY',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  YMAG: { name: 'YMAG',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  YMAX:{ name: 'YMAX',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  LFGY: { name: 'LFGY',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  CHPY: { name: 'CHPY',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  GPTY: { name: 'GPTY',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  QDTY: { name: 'QDTY',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  RDTY: { name: 'RDTY',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  SDTY: { name: 'SDTY',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
  SLTY: { name: 'SLTY',
    price: 1.0000,
    dividend: 0.0000,
    weekly: 0.000000
  },
}
function getPrice(string){
  var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${string}&apikey=${api}`;
  request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
        // data is successfully parsed as a JSON object:
        console.log(data['Global Quote']['05. price']);
        return data['Global Quote']['05. price'];
      }
  });
  
}

async function getDividend(string){
  const $ = await cheerio.fromURL(`https://www.yieldmaxetfs.com/our-etfs/${string}`)
  var test = $('#table_11').find('td');
  console.log($(test[1]).text()) 
  return $(test[1]).text()
}

async function getStockUpdate(){
  console.log("here");
  const html = fs.readFileSync('index.html','utf-8')
  const $ = cheerio.load(html);
  const keys = Object.keys(stocks);
  let stockArray = [];
  keys.forEach(element => {
  stockArray.push(stocks[element]);
  }); 
 
  console.log(stockArray);
  console.log("here2");
  for(const key of keys){
    stocks[key].dividend = await getDividend(stocks[key]['name']);
    stocks[key]['weekly'] = ((stocks[key]['dividend']/stocks[key]['price']) * 100).toFixed(3);
  }
  stockArray.sort((a,b) => b['weekly'] - a['weekly']);
   console.log(stockArray);
  for(var i = 0; i < keys.length; i++){
    console.log("here3",i);
    //stocks[i].price = await getPrice(stocks[i].name);
    const rows = $(`#stock${i}`).find("td");
    console.log($(rows[0]).text())
    $(rows[0]).text(`${stockArray[i]['name']}`)
    $(rows[1]).text(`\$${stockArray[i]['price']}`)
    $(rows[2]).text(`\$${stockArray[i]['dividend']}`)
    $(rows[3]).text(`${stockArray[i]['weekly']}\%`)
    
  }
  const now = new Date;
  $('#date').text(`Updated: ${now}`)
  fs.writeFileSync("index.html", $.html());
  console.log("stock update finshed");
  return null
}

async function writeStocks(){
  const html = fs.readFileSync('index.html','utf-8')
  const $ = cheerio.load(html);
  const keys = Object.keys(parkerStocks);
  console.log(parkerStocks);
  console.log(parkerStocks['ULTY']);
  for(var i = 0; i < stocks.length; i++){
    console.log(`Parker${keys[i]}`)
    const rows = $(`#Parker${keys[i]}`).find('td')
    console.log($(rows[0]).text())
    $(rows[0]).text(`Parker${keys[i]}`)
    $(rows[1]).text(`${parkerStocks[keys[i]]['amount']} shares`)
    parkerStocks[keys[i]]['currentDividend'] = parseFloat(stocks[i].dividend)*parseFloat(parkerStocks[keys[i]]['amount']).toFixed(2);
    console.log()
    $(rows[2]).text(`\$${parkerStocks[keys[i]]['currentDividend'].toFixed(3)}`)
    
  }
  fs.writeFileSync("index.html", $.html());
  return

}
async function test() {
  const windowWidth = 1920;
  const windowHeight = 1080;
  const browser = await puppeteer.launch({
  headless: false,
  userDataDir: './my-session',
  args: ['--window-size=1920,1080']
  });
  const page = await browser.newPage();
  await page.goto('https://robinhood.com/login', { waitUntil: 'networkidle2' });
  //await page.type('input[name="username"]','pman8080@gmail.com')
  //await page.type('input[name="password"]', 'Iamparker1221\@\@')
  //await page.click('button[type="submit"]');
  await page._client().send('Emulation.setPageScaleFactor', { pageScaleFactor: 0.1});

  // Get full page dimensions
  const { width, height } = await page.evaluate(() => {
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight
    };
  });

  // Resize viewport to fit everything
  await page.setViewport({
    width: Math.ceil(width),
    height: Math.ceil(height),
    deviceScaleFactor: 0.1
  });
  


  
  await page.waitForSelector('.ReactVirtualized__Grid__innerScrollContainer', { timeout: 10000 });

  console.log("True");
  const content = await page.content();
  const $ = cheerio.load(content);
  const testing = $('[data-testid="PositionCell"]  .css-14ulni3')
  let testing2 = $('[data-testid="PositionCell"]  .css-1ezzyzy')
  let testing3 = $('[data-testid="PositionCell"]  .css-y3z1hq').filter((i, el) => {
  const directText = $(el)
    .contents()
    .filter((_, node) => node.type === 'text')
    .text()
    .trim();

  return directText.length > 0;});
  console.log($(testing).text());
  console.log($(testing2).text());
  console.log($(testing3).text());
  testing.each((i,el) => {
    const text1 = $(el).text();
    if(i !=  testing.length ){
      parkerStocks[`${$(testing2[i]).text()}`]['amount'] = parseFloat(text1.split(' ')[1]);
      stocks[`${$(testing2[i]).text()}`]['price']= parseFloat($(testing3[i]).text().replace(/\$/,''));
      console.log(i,$(testing3[i]).text());
      console.log("hello:", stocks[`${$(testing2[i]).text()}`]['price'])
      
    }
    const text2 = $(testing2[i]).text();
    console.log(text1)
    console.log(text2)
  })
  testing2 = $('.css-1ml9tbj .css-1ezzyzy')
  testing3 = $('.css-dnp3pp  .css-y3z1hq').filter((i, el) => {
  const directText = $(el)
    .contents()
    .filter((_, node) => node.type === 'text')
    .text()
    .trim();

  return directText.length > 0;});
  testing2.each((i,el) => {
    const text1 = $(el).text();
    
    console.log('here', text1);
    console.log('here', $(testing3[i]).text());
    
    if(stocks[`${$(testing2[i]).text()}`] !== undefined){
      
      stocks[`${$(testing2[i]).text()}`]['price']= parseFloat($(testing3[i]).text().replace(/\$/,''));
      
    }
  })
  console.log("finished in test")
  browser.close();
  await writeStocks();
  return
}
async function main(){
  
  await test();
  await getStockUpdate();
  await writeStocks();
  console.log("Waiting");
  await new Promise(resolve => setTimeout(resolve, 100000000))
  console.log("finished waiting");
  main()
}
main();
